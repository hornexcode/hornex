from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class HornexTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["user_name"] = user.name
        # ...

        return token
