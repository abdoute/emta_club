from flask import Blueprint, request, jsonify
import os
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db
from .models import User

auth = Blueprint('auth', __name__, url_prefix='/api/auth')


def _normalize_email(email: str) -> str:
    return (email or '').strip().lower()

def _is_admin_email(email: str) -> bool:
    emails = os.getenv('ADMIN_EMAILS', '')
    if not emails:
        return False
    allowed = [e.strip().lower() for e in emails.split(',') if e.strip()]
    return _normalize_email(email) in allowed

@auth.post('/signup')
def signup():
    data = request.get_json(silent=True) or {}
    required = ['name', 'email', 'registration', 'level', 'specialty']
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify(ok=False, error='Missing fields', fields=missing), 400

    email = _normalize_email(data.get('email'))
    registration = str(data.get('registration')).strip()

    # Basic validation
    if '@' not in email or '.' not in email:
        return jsonify(ok=False, error='Invalid email'), 400
    if not registration.isdigit() or not (8 <= len(registration) <= 12):
        return jsonify(ok=False, error='Invalid registration'), 400

    # Check uniqueness
    if User.query.filter((User.email == email) | (User.registration == registration)).first():
        return jsonify(ok=False, error='Email or registration already exists'), 409

    # Default password = registration if not provided
    raw_password = str(data.get('password') or registration)
    pwd_hash = generate_password_hash(raw_password)

    user = User(
        name=str(data.get('name')).strip(),
        email=email,
        registration=registration,
        level=str(data.get('level')).strip(),
        specialty=str(data.get('specialty')).strip(),
        password_hash=pwd_hash,
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify(ok=True, token=token, user={
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'registration': user.registration,
        'level': user.level,
        'specialty': user.specialty,
        'is_admin': _is_admin_email(user.email),
    }), 201


@auth.post('/login')
def login():
    data = request.get_json(silent=True) or {}
    email = _normalize_email(data.get('email'))
    password = str(data.get('password') or '')

    if not email or not password:
        return jsonify(ok=False, error='Email and password are required'), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify(ok=False, error='Invalid credentials'), 401

    token = create_access_token(identity=str(user.id))
    return jsonify(ok=True, token=token)


@auth.get('/me')
@jwt_required()
def me():
    uid_raw = get_jwt_identity()
    try:
        uid = int(uid_raw)
    except Exception:
        return jsonify(ok=False, error='Invalid token'), 401
    user = User.query.get(uid)
    if not user:
        return jsonify(ok=False, error='User not found'), 404
    return jsonify(ok=True, user={
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'registration': user.registration,
        'level': user.level,
        'specialty': user.specialty,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'is_admin': _is_admin_email(user.email),
    })


@auth.put('/me')
@jwt_required()
def update_me():
    uid_raw = get_jwt_identity()
    try:
        uid = int(uid_raw)
    except Exception:
        return jsonify(ok=False, error='Invalid token'), 401
    user = User.query.get(uid)
    if not user:
        return jsonify(ok=False, error='User not found'), 404

    data = request.get_json(silent=True) or {}
    # Allow updating limited profile fields
    name = str(data.get('name', '')).strip()
    level = str(data.get('level', '')).strip()
    specialty = str(data.get('specialty', '')).strip()

    if name:
        user.name = name
    if level:
        user.level = level
    if specialty:
        user.specialty = specialty

    db.session.commit()
    return jsonify(ok=True)
