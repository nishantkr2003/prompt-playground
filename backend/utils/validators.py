SUPPORTED_PROVIDERS = ["gemini", "groq"]

def validate_generate_request(data):
    """
    Validate /api/generate request payload
    Returns:
        None if valid
        Error message string if invalid
    """

    # Check JSON Body
    if not data:
        return "Request body is required"

    
    # Required Prompt
    user_prompt = data.get("user_prompt")

    if not user_prompt:
        return "user_prompt is required"

    if not isinstance(user_prompt, str):
        return "user_prompt must be a string"

    if len(user_prompt.strip()) < 1:
        return "user_prompt cannot be empty"

    if len(user_prompt) > 50000:
        return "user_prompt exceeds maximum allowed length"

    
    # System Prompt
    
    system_prompt = data.get("system_prompt", "")

    if system_prompt and not isinstance(system_prompt, str):
        return "system_prompt must be a string"

    
    # Provider Validation
    provider = data.get("provider", "gemini")

    if provider not in SUPPORTED_PROVIDERS:
        return f"Unsupported provider. Supported: {', '.join(SUPPORTED_PROVIDERS)}"

    
    # Temperature
    try:
        temperature = float(data.get("temperature", 0.7))

        if temperature < 0 or temperature > 2:
            return "temperature must be between 0 and 2"

    except (ValueError, TypeError):
        return "temperature must be a valid number"
    

    # Top P
    try:
        top_p = float(data.get("top_p", 1.0))

        if top_p < 0 or top_p > 1:
            return "top_p must be between 0 and 1"

    except (ValueError, TypeError):
        return "top_p must be a valid number"

    
    # Max Tokens
    try:
        max_tokens = int(data.get("max_tokens", 1024))

        if max_tokens < 1 or max_tokens > 8192:
            return "max_tokens must be between 1 and 8192"

    except (ValueError, TypeError):
        return "max_tokens must be a valid integer"

    
    # Stop Sequences
    stop_sequences = data.get("stop_sequences", [])

    if stop_sequences and not isinstance(stop_sequences, list):
        return "stop_sequences must be a list"

    
    # Prompt ID (Optional)
    
    prompt_id = data.get("prompt_id")

    if prompt_id is not None:
        try:
            int(prompt_id)
        except (ValueError, TypeError):
            return "prompt_id must be an integer"

    return None