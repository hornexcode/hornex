#!/bin/bash

set -Eeuo pipefail

function main() (
  echo "Waiting for postgres..."

  python wait_for_postgres.py

  command="${1:-}"

  case "$command" in
    "runsetup")
      run_setup
      ;;
    *)
      python manage.py $@
      exit 1
      ;;
  esac
)

function run_setup() (
  printf "\n\n"
  echo "Running migrations..."
  echo "====================="
  python manage.py migrate
  echo "Done!"

  printf "\n\n"
  echo "Seeding database..."
  echo "====================="
  python ./bin/seed_database.py
  echo "Done!"

  printf "\n\n"
  echo "Running server..."
  echo "====================="
  python manage.py runserver 0.0.0.0:8000
)

main $@
