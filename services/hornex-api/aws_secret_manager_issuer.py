#!/usr/bin/env python3.11
# Use this code snippet in your app.
# If you need more information about configurations
# or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/python/
import json
import logging
import logging.config
from pathlib import Path

import boto3
import structlog
from botocore.exceptions import ClientError

from core.settings import LOGGING

logging.config.dictConfig(LOGGING)
logger = structlog.get_logger(Path(__file__).stem)


logger.info("Retrieving secret")


def get_secret():
    secret_name = "prod/hornex-api"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    # cache_config = SecretCacheConfig()
    # cache = SecretCache(config=cache_config, client=client)

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    secret = json.loads(get_secret_value_response.get("SecretString"))
    env = [f"{k}={v}" for k, v in secret.items()]

    secrets_output_file = Path(__file__).resolve().parent / "app.env"
    secrets_output_file.write_text("\n".join(env) + "\n")
    logger.info(f"Wrote {len(env)} secrets to {secrets_output_file}")


if __name__ == "__main__":
    get_secret()
