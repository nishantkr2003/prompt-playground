import json
import re


class OutputParser:
    """
    Parse and structure LLM outputs for frontend rendering
    """
    # JSON DETECTION
    
    def parse_json(self, text):
        """
        Detect and validate JSON output
        """
        try:
            parsed = json.loads(text)

            return {
                "type": "json",
                "valid": True,
                "content": parsed
            }

        except Exception:
            return {
                "type": "json",
                "valid": False,
                "content": None
            }

    
    # CODE BLOCK EXTRACTION
    
    def extract_code_blocks(self, text):
        """
        Extract triple-backtick code blocks
        """
        pattern = r"```(\w+)?\n(.*?)```"

        matches = re.findall(pattern, text, re.DOTALL)

        code_blocks = []

        for language, code in matches:
            code_blocks.append({
                "language": language if language else "plaintext",
                "code": code.strip()
            })

        return {
            "type": "code",
            "count": len(code_blocks),
            "content": code_blocks
        }

   
    # BULLET / LIST DETECTION
    def parse_lists(self, text):
        """
        Detect bullet points or numbered lists
        """
        lines = text.splitlines()

        bullets = []

        for line in lines:
            stripped = line.strip()

            if stripped.startswith(("-", "*")):
                bullets.append(stripped)

            elif re.match(r"^\d+\.", stripped):
                bullets.append(stripped)

        return {
            "type": "list",
            "count": len(bullets),
            "content": bullets
        }

    
    # TABLE DETECTION
    
    def parse_tables(self, text):
        """
        Detect markdown-like tables
        """
        lines = text.splitlines()

        table_lines = [line for line in lines if "|" in line]

        if len(table_lines) >= 2:
            return {
                "type": "table",
                "valid": True,
                "content": table_lines
            }

        return {
            "type": "table",
            "valid": False,
            "content": []
        }

    
    # MARKDOWN DEFAULT
    
    def parse_markdown(self, text):
        """
        Default markdown/text response
        """
        return {
            "type": "markdown",
            "content": text
        }

   
    # MASTER PARSER
    
    def parse(self, text):
        """
        Auto-detect best output structure
        Priority:
        JSON → Code → Table → List → Markdown
        """

        # JSON
        json_result = self.parse_json(text)

        if json_result["valid"]:
            return json_result

        # Code
        code_result = self.extract_code_blocks(text)

        if code_result["count"] > 0:
            return code_result

        # Table
        table_result = self.parse_tables(text)

        if table_result["valid"]:
            return table_result

        # List
        list_result = self.parse_lists(text)

        if list_result["count"] > 0:
            return list_result

        # Default
        return self.parse_markdown(text)