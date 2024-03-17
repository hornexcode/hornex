import asyncio

import structlog
from django.core.management.base import BaseCommand

from pkg.grpc.server import main

logger = structlog.get_logger(__name__)


class Command(BaseCommand):
    help = "Run gRPC server"

    def handle(self, *args, **options):
        logger.info("Starting gRPC server...")
        asyncio.get_event_loop().run_until_complete(main())
