import json
import os

from flask import Blueprint, jsonify

templates_bp = Blueprint("templates", __name__)


# Load Templates from JSON

def load_templates():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    file_path = os.path.join(base_dir, "data", "templates.json")

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)



# GET ALL TEMPLATES

@templates_bp.route("/templates", methods=["GET"])
def get_templates():
    try:
        templates = load_templates()

        return jsonify({
            "status": "success",
            "count": len(templates),
            "data": templates
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# GET TEMPLATE BY ID

@templates_bp.route("/templates/<int:template_id>", methods=["GET"])
def get_template(template_id):
    try:
        templates = load_templates()

        template = next(
            (t for t in templates if t["id"] == template_id),
            None
        )

        if not template:
            return jsonify({
                "status": "error",
                "message": "Template not found"
            }), 404

        return jsonify({
            "status": "success",
            "data": template
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500