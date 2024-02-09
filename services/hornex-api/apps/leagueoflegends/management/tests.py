from io import StringIO
from unittest.mock import Mock, patch

from django.core.management import call_command
from django.test import TestCase
from requests import Response

from apps.leagueoflegends.models import Provider


class TestLeagueOfLegendsCommands(TestCase):
    @patch("requests.post")
    def test_registertournamentprovider(self, mock_post):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = 7

        mock_post.return_value = mock_response

        out = StringIO()

        call_command(
            "registertournamentprovider",
            "BR",
            "https://www.hornex.gg/api/v1/riotcallback",
            stdout=out,
        )

        provider = Provider.objects.first()

        self.assertEqual(Provider.objects.count(), 1)
        self.assertEqual(provider.id, 7)
        output = out.getvalue()
        self.assertIn("Successfully created tournament provider", output)

    def test_registertournamentprovider_miss_args(self):
        try:
            call_command(
                "registertournamentprovider",
            )

        except Exception as e:
            self.assertRaises(Exception)
            self.assertEqual(
                str(e),
                "Error: the following arguments are required: region, url",
            )
