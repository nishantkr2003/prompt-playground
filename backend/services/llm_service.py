import time
import requests

from config import current_config
from services.token_counter import TokenCounter


class LLMService:
    """
    Unified LLM Service Layer
    Supports Gemini, Groq, OpenAI (extensible)
    """

    def __init__(self):
        self.default_provider = current_config.DEFAULT_PROVIDER
        self.token_counter = TokenCounter()

    
    # PUBLIC GENERATION METHOD
    def generate(
        self,
        user_prompt,
        system_prompt="",
        provider=None,
        temperature=0.7,
        top_p=1.0,
        max_tokens=1024,
        stop_sequences=None
    ):
        provider = provider or self.default_provider

        start_time = time.time()

        if provider == "gemini":
            response_text = self._gemini_generate(
                user_prompt=user_prompt,
                system_prompt=system_prompt,
                temperature=temperature,
                top_p=top_p,
                max_tokens=max_tokens
            )

        elif provider == "groq":
            response_text = self._groq_generate(
                user_prompt=user_prompt,
                system_prompt=system_prompt,
                temperature=temperature,
                top_p=top_p,
                max_tokens=max_tokens
            )

        else:
            raise ValueError(f"Unsupported provider: {provider}")

        latency = round(time.time() - start_time, 2)

        token_usage = self.token_counter.total_usage(
            system_prompt,
            user_prompt,
            response_text
        )

        return {
            "provider": provider,
            "response": response_text,
            "latency": latency,
            "tokens": token_usage
        }

    # GEMINI
    def _gemini_generate(
        self,
        user_prompt,
        system_prompt,
        temperature,
        top_p,
        max_tokens
    ):
        api_key = current_config.GEMINI_API_KEY
        GEMINI_MODEL = "gemini-flash-lite-latest"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"

        full_prompt = f"{system_prompt}\n\n{user_prompt}" if system_prompt else user_prompt

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": full_prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "topP": top_p,
                "maxOutputTokens": max_tokens
            }
        }

        response = requests.post(url, json=payload, timeout=current_config.REQUEST_TIMEOUT)

        if response.status_code != 200:
            print(response.text)
            raise Exception(f"Gemini API Error: {response.text}")

        data = response.json()

        return data["candidates"][0]["content"]["parts"][0]["text"]

    # GROQ
    
    def _groq_generate(
        self,
        user_prompt,
        system_prompt,
        temperature,
        top_p,
        max_tokens
    ):
        api_key = current_config.GROQ_API_KEY

        url = "https://api.groq.com/openai/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        messages = []

        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })

        messages.append({
            "role": "user",
            "content": user_prompt
        })

        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": messages,
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens
        }

        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=current_config.REQUEST_TIMEOUT
        )

        if response.status_code != 200:
            raise Exception(f"Groq API Error: {response.text}")

        data = response.json()

        return data["choices"][0]["message"]["content"]

    
    # COMPARE MODE
    def compare_prompts(self, prompt_a, prompt_b, **kwargs):
        result_a = self.generate(user_prompt=prompt_a, **kwargs)
        result_b = self.generate(user_prompt=prompt_b, **kwargs)

        return {
            "prompt_a": result_a,
            "prompt_b": result_b
        }

    
    # PARAMETER SWEEP
    
    def parameter_sweep(
        self,
        user_prompt,
        temperatures,
        top_ps,
        **kwargs
    ):
        results = []

        for temp in temperatures:
            for top_p in top_ps:
                result = self.generate(
                    user_prompt=user_prompt,
                    temperature=temp,
                    top_p=top_p,
                    **kwargs
                )

                results.append({
                    "temperature": temp,
                    "top_p": top_p,
                    "result": result
                })

        return results