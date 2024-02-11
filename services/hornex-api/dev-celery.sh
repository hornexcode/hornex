#!/bin/bash

set -Eeuxo pipefail

poetry install --sync --no-root
./wait_for_postgres.py

while true; do
  poetry run celery \
    --app=core worker \
    --concurrency=4 \
    --loglevel=INFO \
    --events
  sleep 10
done
