from datetime import datetime, timedelta
from .redis_client import redis_client

class RateLimiter:
    def __init__(self, max_requests: int = 5, window_minutes: int = 5):
        self.max_requests = max_requests
        self.window_minutes = window_minutes

    def can_make_request(self, client_ip: str) -> bool:
        """
        Check if a client can make a request based on their IP address
        Returns True if allowed, False if rate limit exceeded
        """
        key = f"rate_limit:{client_ip}"
        current_time = datetime.utcnow()
        
        # Get current request count
        request_count = redis_client.get(key)
        
        if not request_count:
            # First request from this IP
            redis_client.setex(
                key,
                timedelta(minutes=self.window_minutes),
                1
            )
            return True
            
        request_count = int(request_count)
        if request_count >= self.max_requests:
            return False
            
        # Increment request count
        redis_client.incr(key)
        return True
