import logging
import logging.config
import time
from pathlib import Path

import psycopg2
import structlog

from core.settings import LOGGING, get_settings

logging.config.dictConfig(LOGGING)
logger = structlog.get_logger(Path(__file__).stem)

log = logger.bind(database="postgres")


log.info("waiting for databases")

attempt = 0
while True:
    attempt += 1
    log.info("checking", attempt=attempt)

    try:
        psycopg2.connect(
            host=get_settings("HORNEX_SQL_HOST"),
            dbname="hornex",
            user=get_settings("HORNEX_SQL_USER"),
            password=get_settings("HORNEX_SQL_PASSWORD"),
            connect_timeout=3,
        )
        log.info("success", attempt=attempt)
        break

    except Exception as e:
        log.info("sleeping", attempt=attempt, error=e)
        time.sleep(2)
