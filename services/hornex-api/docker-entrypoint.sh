#!/bin/bash

set -Eeuo pipefail

function main() (
  echo "Waiting for postgres..."

  python wait_for_postgres.py

  run_setup
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
  python manage.py migrate
  echo "Done!"

  printf "\n\n"
  echo "Running server..."
  echo "====================="
  python manage.py runserver 0.0.0.0:8000
)

main
