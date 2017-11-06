from __future__ import absolute_import

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sentry.api.base import Endpoint
from sentry.guide import manager
from sentry.models import Organization, Project


class DugoutEndpoint(Endpoint):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        project = Project.objects.first()
        organization = Organization.objects.first()
        guide = manager.all()[0]
        return Response(guide.to_dict(project=project, organization=organization))
