import logging
import logging.config
import time
from pathlib import Path

import psycopg2
import requests
import structlog

from config.settings import LOGGING, get_settings

logging.config.dictConfig(LOGGING)
logger = structlog.get_logger(Path(__file__).stem)

logger.info("waiting for databases")

log = logger.bind(database="postgres")
attempt = 0
while True:
    attempt += 1
    log.info("checking", attempt=attempt)

    try:
        psycopg2.connect(
            host=get_settings("DB_HOST_DEFAULT"),
            dbname="api_content",
            user=get_settings("DB_USER"),
            password=get_settings("DB_PASS"),
            connect_timeout=3,
        )
        log.info("success", attempt=attempt)
        break

    except Exception as e:
        log.info("sleeping", attempt=attempt, error=e)
        time.sleep(2)

if get_settings("ELASTICSEARCH_HOST", "none").lower() == "search":
    log = logger.bind(database="elasticsearch")
    attempt = 0
    while True:
        attempt += 1
        log.info("checking", attempt=attempt)

        try:
            requests.get(f"http://{get_settings('ELASTICSEARCH_HOST')}:9200", timeout=3)
            log.info("success", attempt=attempt)
            break

        except Exception as e:
            log.info("sleeping", attempt=attempt, error=e)
            time.sleep(2)
