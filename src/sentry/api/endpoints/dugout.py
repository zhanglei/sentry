from __future__ import absolute_import

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sentry.api.base import Endpoint


class DugoutEndpoint(Endpoint):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        return Response({})
