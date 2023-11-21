from django.http import parse_cookie


class CookieMiddleware:
    """
    Extracts cookies from HTTP or WebSocket-style scopes and adds them as a
    scope["cookies"] entry with the same format as Django's request.COOKIES.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Check this actually has headers. They're a required scope key for HTTP and WS.
        if "headers" not in scope:
            raise ValueError(
                "CookieMiddleware was passed a scope that did not have a headers key "
                + "(make sure it is only passed HTTP or WebSocket connections)"
            )
        # Go through headers to find the cookie one
        cookies = {}
        for name, value in scope.get("headers", []):
            if name == b"cookie":
                cookies = parse_cookie(value.decode("latin1"))
                break

        # Return inner application
        return await self.inner(dict(scope, cookies=cookies), receive, send)
