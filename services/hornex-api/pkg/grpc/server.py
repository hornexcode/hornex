from concurrent import futures

import structlog

import grpc
from pkg.grpc import match_pb2_grpc
from pkg.grpc.match_service import MatchServicer

logger = structlog.get_logger(__name__)


async def main() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    match_pb2_grpc.add_MatchServiceServicer_to_server(MatchServicer(), server)
    server.add_insecure_port("[::]:50051")
    logger.info("Starting gRPC server on [::]:50051")

    server.start()
    server.wait_for_termination()


# if __name__ == "__main__":
#     logger.info("Starting gRPC server")
#     asyncio.get_event_loop().run_until_complete(serve())
