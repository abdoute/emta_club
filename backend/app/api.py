import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from .models import MemberApplication, ContactMessage, User

api = Blueprint('api', __name__, url_prefix='/api')


def _normalize_email(email: str) -> str:
    return (email or '').strip().lower()


def _is_admin_email(email: str) -> bool:
    emails = os.getenv('ADMIN_EMAILS', '')
    if not emails:
        return False
    allowed = [e.strip().lower() for e in emails.split(',') if e.strip()]
    return _normalize_email(email) in allowed


@api.post('/members/apply')
def apply_member():
    data = request.get_json(silent=True) or {}
    
    # Debug logging
    print(f"API received data: {data}")
    print(f"Phone field received: '{data.get('phone', 'NOT_FOUND')}'")

    required = ['name', 'email', 'registration', 'level', 'specialty', 'message']
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify(ok=False, error='Missing fields', fields=missing), 400

    # Basic validations
    email = data.get('email', '').strip()
    if '@' not in email or '.' not in email:
        return jsonify(ok=False, error='Invalid email'), 400

    reg = data.get('registration', '').strip()
    if not reg.isdigit() or not (8 <= len(reg) <= 12):
        return jsonify(ok=False, error='Invalid registration'), 400

    phone_value = str(data.get('phone', '')).strip() or None
    print(f"Phone value to save: '{phone_value}'")
    
    app_obj = MemberApplication(
        name=data.get('name', '').strip(),
        email=email,
        registration=reg,
        level=str(data.get('level', '')).strip(),
        specialty=str(data.get('specialty', '')).strip(),
        phone=phone_value,
        message=str(data.get('message', '')).strip(),
    )
    db.session.add(app_obj)
    db.session.commit()
    
    print(f"Application saved with ID: {app_obj.id}, Phone: '{app_obj.phone}'")

    return jsonify(ok=True, id=app_obj.id), 201


@api.post('/contact/messages')
def create_contact_message():
    data = request.get_json(silent=True) or {}

    required = ['name', 'email', 'subject', 'message']
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify(ok=False, error='Missing fields', fields=missing), 400

    email = data.get('email', '').strip()
    if '@' not in email or '.' not in email:
        return jsonify(ok=False, error='Invalid email'), 400

    msg = ContactMessage(
        name=str(data.get('name', '')).strip(),
        email=email,
        subject=str(data.get('subject', '')).strip(),
        phone=str(data.get('phone', '')).strip() or None,
        message=str(data.get('message', '')).strip(),
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify(ok=True, id=msg.id), 201


@api.get('/members/applications')
@jwt_required()
def list_member_applications():
    # For now, unauthenticated listing for dev convenience
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

    limit = request.args.get('limit', default=50, type=int)
    rows = (MemberApplication.query
            .order_by(MemberApplication.id.desc())
            .limit(limit)
            .all())
    data = [
        {
            'id': r.id,
            'name': r.name,
            'email': r.email,
            'registration': r.registration,
            'level': r.level,
            'specialty': r.specialty,
            'phone': r.phone,
            'message': r.message,
            'created_at': r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
    ]
    return jsonify(ok=True, items=data)


@api.get('/activities/upcoming')
def activities_upcoming():
    # Stub data for now; later can be sourced from DB
    items = [
        {
            'id': 1,
            'title': 'Arduino Workshop - Advanced Projects',
            'description': 'Learn advanced Arduino programming and build complex projects. Perfect for intermediate to advanced students.',
            'date': '2025-02-15',
            'type': 'Workshop',
            'location': 'Lab A - Building 1',
            'time': '14:00 - 17:00',
            'status': 'upcoming',
        },
        {
            'id': 2,
            'title': 'AI & Machine Learning Seminar',
            'description': 'Introduction to AI concepts and practical machine learning applications. Guest speaker from industry.',
            'date': '2025-02-22',
            'type': 'Conference',
            'location': 'Main Auditorium',
            'time': '10:00 - 12:00',
            'status': 'upcoming',
        },
        {
            'id': 3,
            'title': 'Hackathon 2025 - Innovation Challenge',
            'description': '48-hour hackathon focusing on smart city solutions. Teams of 3-5 members. Prizes for top 3 teams.',
            'date': '2025-03-10',
            'type': 'Competition',
            'location': 'University Campus',
            'time': '09:00 - 17:00',
            'status': 'upcoming',
        },
    ]
    return jsonify(ok=True, items=items)


@api.get('/activities/past')
def activities_past():
    items = [
        {
            'id': 4,
            'title': 'Robotics Workshop - Basics',
            'description': 'Introduction to robotics, sensors, and actuators. Hands-on experience with our robot kits.',
            'date': '2024-12-10',
            'type': 'Workshop',
            'location': 'Lab B',
            'time': '14:00 - 17:00',
            'status': 'past',
        },
        {
            'id': 5,
            'title': 'Scientific Day E-MTA 2024',
            'description': 'Annual scientific day featuring student projects, presentations, and networking opportunities.',
            'date': '2024-11-20',
            'type': 'Conference',
            'location': 'Main Hall',
            'time': '09:00 - 17:00',
            'status': 'past',
        },
        {
            'id': 6,
            'title': 'Web Development Bootcamp',
            'description': 'Intensive 3-day bootcamp on modern web development. HTML, CSS, JavaScript, and frameworks.',
            'date': '2024-10-15',
            'type': 'Workshop',
            'location': 'Computer Lab',
            'time': '09:00 - 16:00',
            'status': 'past',
        },
    ]
    return jsonify(ok=True, items=items)
