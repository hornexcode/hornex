import structlog

from pkg.grpc import match_pb2, match_pb2_grpc

logger = structlog.get_logger(__name__)


class MatchServicer(match_pb2_grpc.MatchServiceServicer):
    def Retrieve(self, request, context):
        logger.info("request", id=request.id)
        return match_pb2.Match(id="test")
