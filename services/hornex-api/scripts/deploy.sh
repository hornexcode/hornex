#!/usr/bin/env bash
set -Eeuo pipefail

REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && git rev-parse --show-toplevel)
source ${REPO_ROOT}/devops/scripts/helpers

info "Deploying api..."

echo "${AWS_PEM_FILE}" > "${REPO_ROOT}/hornex-api.pem"
chmod 400 "${REPO_ROOT}/hornex-api.pem"

# Connect to the ec2 instance
ssh -o StrictHostKeyChecking=no -i "${REPO_ROOT}/hornex-api.pem" $AWS_EC2_HOSTNAME '
  cd hornex-api
  git pull
  cd services/hornex-api
  ./.venv/bin/python3 manage.py migrate
  sudo systemctl restart gunicorn
  '

info "Successfully deployed the api"
