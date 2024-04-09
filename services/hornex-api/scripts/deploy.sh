#!/usr/bin/env bash
set -Eeuo pipefail



REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && git rev-parse --show-toplevel)
source ${REPO_ROOT}/devops/scripts/helpers

info "Deploying api..."

echo "${AWS_PEM_FILE}" > "${REPO_ROOT}/hornex-api.pem"

# Connect to the ec2 instance
ssh -i "${REPO_ROOT}/hornex-api.pem" $AWS_EC2_HOSTNAME << EOF
    cd hornex-api
    git pull
    if [ $? -ne 0 ]; then
      error "Failed to pull the latest changes from the repository"
      exit 1
    fi

    cd services/hornex-api
    ./.venv/bin/python3 manage.py migrate
    if [ $? -ne 0 ]; then
      error "Failed to apply the migrations"
      exit 1
    fi

    sudo systemctl restart gunicorn
    if [ $? -ne 0 ]; then
      error "Failed to restart the gunicorn service"
      exit 1
    fi
    echo "Successfully deployed the api"
