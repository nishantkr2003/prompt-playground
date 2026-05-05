from flask import Blueprint, request, jsonify

from services.llm_service import LLMService
from models.database import db, PromptHistory
from utils.validators import validate_generate_request


generate_bp = Blueprint("generate", __name__)

llm_service = LLMService()


@generate_bp.route("/generate", methods=["POST"])
def generate():
    """
    Generate LLM response from prompt input
    """

    try:
        data = request.get_json()

        # Validate Request
        validation_error = validate_generate_request(data)

        if validation_error:
            return jsonify({
                "status": "error",
                "message": validation_error
            }), 400

        
        # Extract Inputs
        user_prompt = data.get("user_prompt")
        system_prompt = data.get("system_prompt", "")

        provider = data.get("provider", "gemini")

        temperature = float(data.get("temperature", 0.7))
        top_p = float(data.get("top_p", 1.0))
        max_tokens = int(data.get("max_tokens", 1024))

        stop_sequences = data.get("stop_sequences", [])

        prompt_id = data.get("prompt_id")

        
        # Generate Response
        
        result = llm_service.generate(
            user_prompt=user_prompt,
            system_prompt=system_prompt,
            provider=provider,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
            stop_sequences=stop_sequences
        )

    
        # Save Execution History
        
        history_entry = PromptHistory(
            prompt_id=prompt_id,
            provider=result["provider"],
            response=result["response"],
            tokens_input=result["tokens"]["total_input_tokens"],
            tokens_output=result["tokens"]["output_tokens"],
            latency=result["latency"],
            temperature=temperature,
            top_p=top_p
        )

        db.session.add(history_entry)
        db.session.commit()

        # Success Response
        
        return jsonify({
            "status": "success",
            "message": "Prompt generated successfully",
            "data": {
                "response": result["response"],
                "provider": result["provider"],
                "latency": result["latency"],
                "tokens": result["tokens"]
            }
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