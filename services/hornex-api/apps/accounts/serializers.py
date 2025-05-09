from collections import OrderedDict

from rest_framework import serializers

from apps.accounts.models import GameID, Profile


class GameIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameID
        fields = "__all__"


from rest_framework.relations import PKOnlyObject  # NOQA #
from rest_framework.fields import (  # NOQA # isort:skip
    SkipField,
)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"

    def to_representation(self, instance):
        """
        Object instance -> Dict of primitive datatypes.
        """
        ret = OrderedDict()
        fields = self._readable_fields

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            # We skip `to_representation` for `None` values so that fields do
            # not have to explicitly deal with that case.
            #
            # For related fields with `use_pk_only_optimization` we need to
            # resolve the pk value.
            check_for_none = (
                attribute.pk if isinstance(attribute, PKOnlyObject) else attribute
            )
            if check_for_none is None:
                continue
            else:
                ret[field.field_name] = field.to_representation(attribute)

        return ret
