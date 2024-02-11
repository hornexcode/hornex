#!/bin/bash

set -Eeuxo pipefail

poetry install --sync --no-root
./wait_for_postgres.py
./manage.py migrate
./bin/seed_database.py

while true; do
  ./manage.py runserver 0.0.0.0:8000
  sleep 10
done
