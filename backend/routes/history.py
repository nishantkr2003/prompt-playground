from flask import Blueprint, request, jsonify
from models.database import PromptHistory


history_bp = Blueprint("history", __name__)

# GET ALL HISTORY

@history_bp.route("/history", methods=["GET"])
def get_history():
    try:
        provider = request.args.get("provider")
        prompt_id = request.args.get("prompt_id")

        query = PromptHistory.query

        if provider:
            query = query.filter_by(provider=provider)

        if prompt_id:
            query = query.filter_by(prompt_id=prompt_id)

        history_entries = query.order_by(
            PromptHistory.created_at.desc()
        ).all()

        return jsonify({
            "status": "success",
            "count": len(history_entries),
            "data": [entry.to_dict() for entry in history_entries]
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# GET SINGLE HISTORY ENTRY

@history_bp.route("/history/<int:history_id>", methods=["GET"])
def get_history_item(history_id):
    try:
        history_entry = PromptHistory.query.get(history_id)

        if not history_entry:
            return jsonify({
                "status": "error",
                "message": "History entry not found"
            }), 404

        return jsonify({
            "status": "success",
            "data": history_entry.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500