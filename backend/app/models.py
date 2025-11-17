from . import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True, index=True)
    registration = db.Column(db.String(20), nullable=False, unique=True, index=True)
    level = db.Column(db.String(20), nullable=False)
    specialty = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

class MemberApplication(db.Model):
    __tablename__ = 'member_applications'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    registration = db.Column(db.String(20), nullable=False, index=True)
    level = db.Column(db.String(20), nullable=False)
    specialty = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())


class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    subject = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(30))
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
