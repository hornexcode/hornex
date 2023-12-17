#!/usr/bin/env python3
"""
A helper script to download a copy of the local development secrets from AWS Secrets Manager
To use a specific AWS Profile set AWS_PROFILE=
"""

import json
import sys
from pathlib import Path

import boto3


def main():
    """
    A helper script to download a copy of the local development secrets from AWS Secrets Manager
    To use a specific AWS Profile set AWS_PROFILE=
    """

    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name="us-east-1")

    try:
        resp = client.get_secret_value(SecretId="local/hornex-api/default")
    except client.exceptions.ResourceNotFoundException as e:
        print(e, "\nDo you need to set 'AWS_PROFILE='?")
        sys.exit(1)

    secret = json.loads(resp["SecretString"])
    env = [f"{k}={v}" for k, v in secret.items()]

    secrets_output_file = Path(__file__).resolve().parent / "local.secrets"
    secrets_output_file.write_text("\n".join(env) + "\n")
    print(f"Wrote {len(env)} secrets to {secrets_output_file}")


if __name__ == "__main__":
    main()
