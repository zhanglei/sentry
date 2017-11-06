from __future__ import absolute_import

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sentry.api.base import Endpoint


class DugoutEndpoint(Endpoint):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        request.GET.get('url')
        platform = 'python'
        project_name = 'Sentry Backend'
        org_slug = 'sentry'
        project_slug = 'sentry'

        result = {
            'id': 'setup-release-tracking',
            'starting_url': 'https://sentry.io/sentry/sentry/',
            'steps': [
                {
                    'title': 'You sent your %s first event!' % platform,
                    'description': 'Silence alerts for issues you\'ve fixed. Set up release tracking to mark issues as "resolved in next release."',
                    'target': '.btn.project-settings',
                    'event': 'click',
                },
                {
                    'title': 'Click on Release Tracking',
                    'description': 'Project Settings is where you configure your %s project.' % project_name,
                    'target': '[href=%s/%s/settings/release-tracking/]' % (org_slug, project_slug),
                    'event': 'click',
                }
            ]
        }
        return Response(result)
