from flask import Blueprint, request, jsonify
from services.llm_service import LLMService


compare_bp = Blueprint("compare", __name__)

llm_service = LLMService()


@compare_bp.route("/compare", methods=["POST"])
def compare_prompts():
    """
    Compare two prompts side-by-side
    """

    try:
        data = request.get_json()

        prompt_a = data.get("prompt_a")
        prompt_b = data.get("prompt_b")

        if not prompt_a or not prompt_b:
            return jsonify({
                "status": "error",
                "message": "prompt_a and prompt_b are required"
            }), 400

        provider = data.get("provider", "gemini")

        temperature = float(data.get("temperature", 0.7))
        top_p = float(data.get("top_p", 1.0))
        max_tokens = int(data.get("max_tokens", 1024))

        system_prompt = data.get("system_prompt", "")

        
        # Compare
       
        results = llm_service.compare_prompts(
            prompt_a=prompt_a,
            prompt_b=prompt_b,
            provider=provider,
            system_prompt=system_prompt,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens
        )

        return jsonify({
            "status": "success",
            "message": "Comparison completed successfully",
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