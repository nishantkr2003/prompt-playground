from flask import Blueprint, request, jsonify
from models.database import db, PromptLibrary, PromptVersions

prompts_bp = Blueprint("prompts", __name__)

# CREATE PROMPT

@prompts_bp.route("/prompts", methods=["POST"])
def create_prompt():
    try:
        data = request.get_json()

        title = data.get("title")
        user_prompt = data.get("user_prompt")

        if not title or not user_prompt:
            return jsonify({
                "status": "error",
                "message": "title and user_prompt are required"
            }), 400

        prompt = PromptLibrary(
            title=title,
            system_prompt=data.get("system_prompt", ""),
            user_prompt=user_prompt,
            technique=data.get("technique", "zero-shot"),
            provider=data.get("provider", "gemini")
        )

        db.session.add(prompt)
        db.session.commit()

        # Initial Version
        version = PromptVersions(
            prompt_id=prompt.id,
            version_number=1,
            system_prompt=prompt.system_prompt,
            user_prompt=prompt.user_prompt
        )

        db.session.add(version)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Prompt created successfully",
            "data": prompt.to_dict()
        }), 201

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# GET ALL PROMPTS
@prompts_bp.route("/prompts", methods=["GET"])
def get_prompts():
    try:
        prompts = PromptLibrary.query.order_by(PromptLibrary.created_at.desc()).all()

        return jsonify({
            "status": "success",
            "count": len(prompts),
            "data": [prompt.to_dict() for prompt in prompts]
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# GET SINGLE PROMPT
@prompts_bp.route("/prompts/<int:prompt_id>", methods=["GET"])
def get_prompt(prompt_id):
    try:
        prompt = PromptLibrary.query.get(prompt_id)

        if not prompt:
            return jsonify({
                "status": "error",
                "message": "Prompt not found"
            }), 404

        versions = PromptVersions.query.filter_by(
            prompt_id=prompt_id
        ).order_by(PromptVersions.version_number.desc()).all()

        return jsonify({
            "status": "success",
            "data": {
                "prompt": prompt.to_dict(),
                "versions": [version.to_dict() for version in versions]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# UPDATE PROMPT

@prompts_bp.route("/prompts/<int:prompt_id>", methods=["PUT"])
def update_prompt(prompt_id):
    try:
        prompt = PromptLibrary.query.get(prompt_id)

        if not prompt:
            return jsonify({
                "status": "error",
                "message": "Prompt not found"
            }), 404

        data = request.get_json()

        # Update Fields
        prompt.title = data.get("title", prompt.title)
        prompt.system_prompt = data.get("system_prompt", prompt.system_prompt)
        prompt.user_prompt = data.get("user_prompt", prompt.user_prompt)
        prompt.technique = data.get("technique", prompt.technique)
        prompt.provider = data.get("provider", prompt.provider)

        # Version Increment
        latest_version = PromptVersions.query.filter_by(
            prompt_id=prompt_id
        ).order_by(PromptVersions.version_number.desc()).first()

        new_version_number = latest_version.version_number + 1 if latest_version else 1

        version = PromptVersions(
            prompt_id=prompt.id,
            version_number=new_version_number,
            system_prompt=prompt.system_prompt,
            user_prompt=prompt.user_prompt
        )

        db.session.add(version)
        db.session.commit()

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Prompt updated successfully",
            "data": prompt.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# DELETE PROMPT
@prompts_bp.route("/prompts/<int:prompt_id>", methods=["DELETE"])
def delete_prompt(prompt_id):
    try:
        prompt = PromptLibrary.query.get(prompt_id)

        if not prompt:
            return jsonify({
                "status": "error",
                "message": "Prompt not found"
            }), 404

        db.session.delete(prompt)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Prompt deleted successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500