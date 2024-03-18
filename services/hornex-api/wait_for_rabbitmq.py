#!/usr/bin/env python3
import logging
import logging.config
import time
from pathlib import Path

import pika
import structlog

from core.settings import LOGGING, get_settings

logging.config.dictConfig(LOGGING)
logger = structlog.get_logger(Path(__file__).stem)

log = logger.bind(database="rabbitmq")

host = get_settings("RABBITMQ_HOST")
user = get_settings("RABBITMQ_USER")
password = get_settings("RABBITMQ_PASSWORD")

attempt = 0
while True:
    attempt += 1
    log.info("checking", attempt=attempt)

    try:
        credentials = pika.PlainCredentials(user, password)
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host, 5672, "/", credentials)
        )
        connection.close()
        break

    except Exception as e:
        log.info("sleeping", attempt=attempt, error=e)
        time.sleep(2)
