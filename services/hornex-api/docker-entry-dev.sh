#!/bin/bash

set -Eeuo pipefail

function main() (
  set -x

  poetry install --sync --no-root
  python3 ./wait_for_postgres.py

  command="${1:-}"

  case "$command" in

    "runsetup")
      python3 manage.py migrate
      python3 ./bin/seed_database.py
      exec python3 manage.py runserver 0.0.0.0:8000
      ;;

    "celery")
      exec celery \
        --app core worker \
        --concurrency=4 \
        --loglevel=INFO \
        --events
      ;;
    "") ;;

    *)
      # shellcheck disable=SC2068
      python3 manage.py $@
      exit 1
      ;;
  esac
)

main $@
