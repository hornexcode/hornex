import uuid
import json
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from apps.notifications.models import Notification


class NotificationTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path(f"/notifications", include("notifications.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    def test_list_notifications_200(self):
        """
        Ensure we can list notifications.
        """

        Notification.objects.create(
            name="test notification 1",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )

        url = reverse("notification-list")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 1)

    def test_list_notifications_filter_by_activity_200(self):
        """
        Ensure we can filter notifications by activity.
        """
        Notification.objects.create(
            name="test notification 1",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )

        url = f"{reverse('notification-list')}?activity={str(Notification.ActivityType.TEAM_INVITATION)}"
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 1)

    def test_list_notifications_filter_by_activity_400(self):
        """
        Ensure we can filter notifications by activity.
        """
        Notification.objects.create(
            name="test notification 1",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )

        url = f"{reverse('notification-list')}?activity=invalid activity"
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            str(resp.data["activity"][0]),
            "Select a valid choice. invalid activity is not one of the available choices.",
        )

    def test_create_notification_201(self):
        """
        Ensure we can create a new notification object.
        """

        url = reverse(
            "notification-list",
        )

        resp = self.client.post(
            url,
            {
                "name": "Test notification",
                "activity": "team_invitation",
                "data": "some data",
                "recipient_id": self.user.id,
            },
        )

        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data["name"], "Test notification")
        self.assertEqual(Notification.objects.count(), 1)

    def test_create_notification_401(self):
        """
        Ensure we can't create a new notification object without authentication.
        """

        # Clean credentials / turn user not authenticated
        self.client.credentials()

        url = reverse(
            "notification-list",
        )
        resp = self.client.post(
            url,
            {},
        )

        self.assertEqual(resp.status_code, 401)

    def test_create_notification_400(self):
        """
        Ensure we can't create a new notification object with a missing field.
        """

        url = reverse(
            "notification-list",
        )

        resp = self.client.post(
            url,
            {"name": "test notification"},
        )

        self.assertEqual(resp.status_code, 400)

    def test_get_notification_by_id_200(self):
        """
        Ensure we can get a notification by its id
        """

        notification = Notification.objects.create(
            name="test notification 1",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )

        url = reverse("notification-details", kwargs={"id": notification.id})

        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(
            resp.data.get("name"),
            "test notification 1",
        )

    def test_get_notification_by_id_404(self):
        """
        Ensure we can get 404 on get notification by id when it does not exist
        """

        url = reverse("notification-details", kwargs={"id": uuid.uuid4()})

        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 404)

    def test_update_notification_200(self):
        """
        Ensure we can partially a notification
        """
        notification = Notification.objects.create(
            name="test notification 1",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )

        url = reverse("notification-details", kwargs={"id": notification.id})

        notification_update = {"name": "updated notification", "data": "updated data"}
        resp = self.client.patch(url, notification_update)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["name"], notification_update["name"])
        self.assertEqual(resp.data["data"], notification_update["data"])
        self.assertEqual(Notification.objects.count(), 1)

    def test_read_notifications_200(self):
        """
        Ensure we can read an notification by filling its property `read_at`
        """
        notification = Notification.objects.create(
            name="test notification 1",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )
        notification_2 = Notification.objects.create(
            name="test notification 2",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )

        self.assertIsNone(notification.read_at)
        self.assertIsNone(notification_2.read_at)

        url = reverse("bulk-update")

        ids = [notification.id, notification_2.id]
        resp = self.client.patch(url, ids)

        self.assertEqual(resp.status_code, 200)

        notification.refresh_from_db()
        notification_2.refresh_from_db()

        self.assertIsNotNone(notification.read_at)
        self.assertIsNotNone(notification_2.read_at)

    def test_delete_notifications_204(self):
        """
        Ensure we can read an notification by filling its property `read_at`
        """
        notification = Notification.objects.create(
            name="test notification 1",
            activity=Notification.ActivityType.TEAM_INVITATION,
            data=json.dumps({"Here goes a test": "Test"}),
            recipient_id=self.user.id,
        )

        url = reverse("notification-details", kwargs={"id": notification.id})
        resp = self.client.delete(url)

        self.assertEqual(resp.status_code, 204)
        self.assertEqual(Notification.objects.count(), 0)
