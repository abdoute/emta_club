from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash

db = SQLAlchemy()


def create_app():
    basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    load_dotenv(os.path.join(basedir, ".env"))

    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev"),
        CORS_ORIGINS=os.getenv("CORS_ORIGINS", "*"),
    )

    # Ensure instance folder exists for SQLite db
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError:
        pass

    # Database configuration (SQLite in instance folder)
    db_path = os.path.join(app.instance_path, "app.db")
    # Include parameters to reduce locking and thread issues
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"sqlite:///{db_path}?check_same_thread=False&timeout=10.0"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
    }

    # JWT configuration
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", os.getenv("SECRET_KEY", "dev-jwt"))
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_EXPIRES", "86400"))  # seconds

    # Initialize DB
    db.init_app(app)
    JWTManager(app)

    # Apply SQLite pragmas to improve concurrency on Windows
    @event.listens_for(Engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        try:
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode=WAL;")
            cursor.execute("PRAGMA busy_timeout=5000;")
            cursor.close()
        except Exception:
            # Safe to ignore if not SQLite or pragmas unsupported
            pass

    # Parse CORS origins (supports comma-separated list or '*')
    origins_env = app.config.get("CORS_ORIGINS", "*")
    origins = [o.strip() for o in origins_env.split(",")] if "," in origins_env else origins_env
    CORS(app, resources={r"/*": {"origins": origins}})

    from .routes import bp as routes_bp
    app.register_blueprint(routes_bp)
    from .api import api as api_bp
    app.register_blueprint(api_bp)
    from .api_auth import auth as auth_bp
    app.register_blueprint(auth_bp)
    from .api_admin import admin as admin_bp
    app.register_blueprint(admin_bp)

    @app.get("/health")
    def health():
        return {"status": "ok"}, 200

    with app.app_context():
        db.create_all()
        # Bootstrap fixed admin user if configured
        try:
            from .models import User
            fixed_email = os.getenv("ADMIN_FIXED_EMAIL", "").strip().lower()
            fixed_password = os.getenv("ADMIN_FIXED_PASSWORD", "")
            if fixed_email and fixed_password:
                user = User.query.filter_by(email=fixed_email).first()
                if not user:
                    user = User(
                        name="Admin",
                        email=fixed_email,
                        registration="00000000",
                        level="Admin",
                        specialty="Admin",
                        password_hash=generate_password_hash(fixed_password),
                    )
                    db.session.add(user)
                    db.session.commit()
                else:
                    # Update password to the fixed one to ensure credentials work
                    user.password_hash = generate_password_hash(fixed_password)
                    db.session.commit()
        except Exception:
            # Avoid breaking app if bootstrap fails
            pass

    return app
