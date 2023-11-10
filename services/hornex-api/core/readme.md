# Instructions

Running asgi with `uvicorn`

```bash
uvicorn core.asgi:application --port 8000 --workers 4 --log-level debug --reload
```

Running redis locally with docker

```bash
docker run -d --name hornex-redis-channels -p 6379:6379 redis/redis-stack-server:latest
```
