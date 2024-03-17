import structlog

from apps.tournaments.grpc.v1.match import match_pb2, match_pb2_grpc
from apps.tournaments.models import Match

logger = structlog.get_logger(__name__)


class MatchServicer(match_pb2_grpc.MatchServiceServicer):
    def Retrieve(self, request, context):
        logger.info("testing match query all...", match_count=Match.objects.count())
        logger.info("Retrieving match...", request=request)
        return match_pb2.Match(id=request)
