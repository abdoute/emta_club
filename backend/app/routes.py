from flask import Blueprint, jsonify

bp = Blueprint("routes", __name__)


@bp.get("/")
def root():
    return jsonify(message="Flask backend ready")
