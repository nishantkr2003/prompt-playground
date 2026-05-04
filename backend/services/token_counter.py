import tiktoken


class TokenCounter:
    """
    Token counting utility for prompt engineering metrics.
    Uses cl100k_base for broad compatibility with GPT/Gemini-like approximations.
    """

    def __init__(self, encoding_name="cl100k_base"):
        try:
            self.encoding = tiktoken.get_encoding(encoding_name)
        except Exception:
            self.encoding = tiktoken.get_encoding("cl100k_base")

    def count_tokens(self, text: str) -> int:
        """
        Count tokens in a given text.
        """
        if not text:
            return 0

        return len(self.encoding.encode(text))

    def count_prompt_tokens(self, system_prompt: str, user_prompt: str) -> dict:
        """
        Count system + user prompt tokens.
        """
        system_tokens = self.count_tokens(system_prompt)
        user_tokens = self.count_tokens(user_prompt)

        total_input = system_tokens + user_tokens

        return {
            "system_tokens": system_tokens,
            "user_tokens": user_tokens,
            "total_input_tokens": total_input
        }

    def estimate_output_tokens(self, response_text: str) -> int:
        """
        Estimate output token count.
        """
        return self.count_tokens(response_text)

    def total_usage(self, system_prompt: str, user_prompt: str, response_text: str) -> dict:
        """
        Full token usage summary.
        """
        input_data = self.count_prompt_tokens(system_prompt, user_prompt)
        output_tokens = self.estimate_output_tokens(response_text)

        total_tokens = input_data["total_input_tokens"] + output_tokens

        return {
            **input_data,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens
        }

    def context_window_warning(self, total_tokens: int, max_context: int = 8192) -> dict:
        """
        Warn if nearing or exceeding context limit.
        """
        usage_percent = (total_tokens / max_context) * 100

        if total_tokens > max_context:
            status = "exceeded"
        elif usage_percent > 80:
            status = "warning"
        else:
            status = "safe"

        return {
            "status": status,
            "usage_percent": round(usage_percent, 2),
            "max_context": max_context
        }

    def estimate_cost(
        self,
        input_tokens: int,
        output_tokens: int,
        input_cost_per_1k: float = 0.001,
        output_cost_per_1k: float = 0.002
    ) -> dict:
        """
        Approximate token cost (customizable by provider).
        """
        input_cost = (input_tokens / 1000) * input_cost_per_1k
        output_cost = (output_tokens / 1000) * output_cost_per_1k

        total_cost = input_cost + output_cost

        return {
            "input_cost": round(input_cost, 6),
            "output_cost": round(output_cost, 6),
            "total_cost": round(total_cost, 6)
        }