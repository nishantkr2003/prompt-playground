from flask import Blueprint, request, jsonify
from services.llm_service import LLMService


sweep_bp = Blueprint("sweep", __name__)

llm_service = LLMService()


@sweep_bp.route("/sweep", methods=["POST"])
def parameter_sweep():
    """
    Run prompt across multiple temperatures and top_p values
    """

    try:
        data = request.get_json()

        user_prompt = data.get("user_prompt")

        if not user_prompt:
            return jsonify({
                "status": "error",
                "message": "user_prompt is required"
            }), 400

        temperatures = data.get("temperatures", [0.3, 0.7, 1.0])

        top_ps = data.get("top_ps", [0.5, 0.8, 1.0])

        provider = data.get("provider", "gemini")

        system_prompt = data.get("system_prompt", "")

        max_tokens = int(data.get("max_tokens", 1024))

        
        # Sweep
        
        results = llm_service.parameter_sweep(
            user_prompt=user_prompt,
            temperatures=temperatures,
            top_ps=top_ps,
            provider=provider,
            system_prompt=system_prompt,
            max_tokens=max_tokens
        )

        return jsonify({
            "status": "success",
            "message": "Parameter sweep completed successfully",
            "total_runs": len(results),
            "data": results
        }), 200

    except ValueError as ve:
        return jsonify({
            "status": "error",
            "message": str(ve)
        }), 400

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500