from flask import Blueprint, request, jsonify

from models.database import db, PromptLibrary, PromptVersions, PromptHistory

export_import_bp = Blueprint("export_import", __name__)



# EXPORT DATA

@export_import_bp.route("/export", methods=["POST"])
def export_data():
    """
    Export prompt library + history
    """

    try:
        prompts = PromptLibrary.query.all()
        history = PromptHistory.query.all()

        export_payload = {
            "prompts": [prompt.to_dict() for prompt in prompts],
            "history": [entry.to_dict() for entry in history]
        }

        return jsonify({
            "status": "success",
            "message": "Export completed successfully",
            "data": export_payload
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# IMPORT PROMPTS

@export_import_bp.route("/import", methods=["POST"])
def import_data():
    """
    Import prompt library from JSON
    """

    try:
        data = request.get_json()

        prompts = data.get("prompts", [])

        imported_count = 0

        for item in prompts:
            prompt = PromptLibrary(
                title=item.get("title"),
                system_prompt=item.get("system_prompt", ""),
                user_prompt=item.get("user_prompt"),
                technique=item.get("technique", "zero-shot"),
                provider=item.get("provider", "gemini")
            )

            db.session.add(prompt)
            db.session.commit()

            version = PromptVersions(
                prompt_id=prompt.id,
                version_number=1,
                system_prompt=prompt.system_prompt,
                user_prompt=prompt.user_prompt
            )

            db.session.add(version)
            db.session.commit()

            imported_count += 1

        return jsonify({
            "status": "success",
            "message": f"{imported_count} prompts imported successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500