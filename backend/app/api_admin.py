from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from . import db
from .models import User, MemberApplication, ContactMessage
from werkzeug.security import check_password_hash, generate_password_hash

admin = Blueprint('admin', __name__, url_prefix='/api/admin')


def _normalize_email(email: str) -> str:
    return (email or '').strip().lower()


def _is_admin_email(email: str) -> bool:
    emails = os.getenv('ADMIN_EMAILS', '')
    if not emails:
        return False
    allowed = [e.strip().lower() for e in emails.split(',') if e.strip()]
    return _normalize_email(email) in allowed


def _require_admin() -> tuple[bool, tuple]:
    uid_raw = get_jwt_identity()
    try:
        uid = int(uid_raw)
    except Exception:
        return False, (jsonify(ok=False, error='Invalid token'), 401)
    user = User.query.get(uid)
    if not user:
        return False, (jsonify(ok=False, error='User not found'), 404)
    if not _is_admin_email(user.email):
        return False, (jsonify(ok=False, error='Admin only'), 403)
    return True, (user,)


@admin.get('/users')
@jwt_required()
def list_users():
    ok, res = _require_admin()
    if not ok:
        return res
    limit = int(request.args.get('limit', 200))
    users = User.query.order_by(User.created_at.desc()).limit(limit).all()
    return jsonify(ok=True, items=[{
        'id': u.id,
        'name': u.name,
        'email': u.email,
        'registration': u.registration,
        'level': u.level,
        'specialty': u.specialty,
        'created_at': u.created_at.isoformat() if u.created_at else None,
    } for u in users])


@admin.get('/applications')
@jwt_required()
def list_applications():
    ok, res = _require_admin()
    if not ok:
        return res
    limit = int(request.args.get('limit', 200))
    apps = MemberApplication.query.order_by(MemberApplication.created_at.desc()).limit(limit).all()
    return jsonify(ok=True, items=[{
        'id': a.id,
        'name': a.name,
        'email': a.email,
        'registration': a.registration,
        'level': a.level,
        'specialty': a.specialty,
        'phone': a.phone,
        'message': a.message,
        'created_at': a.created_at.isoformat() if a.created_at else None,
    } for a in apps])


@admin.get('/messages')
@jwt_required()
def list_messages():
    ok, res = _require_admin()
    if not ok:
        return res
    limit = int(request.args.get('limit', 200))
    msgs = ContactMessage.query.order_by(ContactMessage.created_at.desc()).limit(limit).all()
    return jsonify(ok=True, items=[{
        'id': m.id,
        'name': m.name,
        'email': m.email,
        'subject': m.subject,
        'phone': m.phone,
        'message': m.message,
        'created_at': m.created_at.isoformat() if m.created_at else None,
    } for m in msgs])


@admin.put('/users/<int:user_id>')
@jwt_required()
def update_user(user_id: int):
    ok, res = _require_admin()
    if not ok:
        return res
    user = User.query.get(user_id)
    if not user:
        return jsonify(ok=False, error='User not found'), 404
    data = request.get_json(silent=True) or {}
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


@admin.put('/applications/<int:app_id>')
@jwt_required()
def update_application(app_id: int):
    ok, res = _require_admin()
    if not ok:
        return res
    app_obj = MemberApplication.query.get(app_id)
    if not app_obj:
        return jsonify(ok=False, error='Application not found'), 404
    data = request.get_json(silent=True) or {}
    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip()
    registration = str(data.get('registration', '')).strip()
    level = str(data.get('level', '')).strip()
    specialty = str(data.get('specialty', '')).strip()
    phone = str(data.get('phone', '')).strip()
    message = str(data.get('message', '')).strip()
    if name:
        app_obj.name = name
    if email:
        app_obj.email = email
    if registration:
        app_obj.registration = registration
    if level:
        app_obj.level = level
    if specialty:
        app_obj.specialty = specialty
    if phone:
        app_obj.phone = phone
    if message:
        app_obj.message = message
    db.session.commit()
    return jsonify(ok=True)


@admin.delete('/applications/<int:app_id>')
@jwt_required()
def delete_application(app_id: int):
    ok, res = _require_admin()
    if not ok:
        return res
    app_obj = MemberApplication.query.get(app_id)
    if not app_obj:
        return jsonify(ok=False, error='Application not found'), 404
    db.session.delete(app_obj)
    db.session.commit()
    return jsonify(ok=True)


@admin.delete('/users/<int:user_id>')
@jwt_required()
def delete_user(user_id: int):
    ok, res = _require_admin()
    if not ok:
        return res
    # Prevent deleting self or protected admin emails
    requester_id_raw = get_jwt_identity()
    try:
        requester_id = int(requester_id_raw)
    except Exception:
        return jsonify(ok=False, error='Invalid token'), 401
    user = User.query.get(user_id)
    if not user:
        return jsonify(ok=False, error='User not found'), 404
    # Do not allow deleting yourself
    if user.id == requester_id:
        return jsonify(ok=False, error='Cannot delete your own account'), 400
    # Do not allow deleting protected admin emails
    if _is_admin_email(user.email):
        return jsonify(ok=False, error='Cannot delete admin account'), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify(ok=True)


@admin.post('/change_password')
@jwt_required()
def change_admin_password():
    uid_raw = get_jwt_identity()
    try:
        uid = int(uid_raw)
    except Exception:
        return jsonify(ok=False, error='Invalid token'), 401
    user = User.query.get(uid)
    if not user:
        return jsonify(ok=False, error='User not found'), 404
    if not _is_admin_email(user.email):
        return jsonify(ok=False, error='Admin only'), 403
    data = request.get_json(silent=True) or {}
    current_password = str(data.get('current_password') or '')
    new_password = str(data.get('new_password') or '')
    if not current_password or not new_password:
        return jsonify(ok=False, error='Missing fields'), 400
    if not check_password_hash(user.password_hash, current_password):
        return jsonify(ok=False, error='Current password incorrect'), 400
    if len(new_password) < 6:
        return jsonify(ok=False, error='Password too short'), 400
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify(ok=True)
