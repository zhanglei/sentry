from __future__ import absolute_import

from datetime import timedelta
import json

from django.http import HttpResponse
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sentry.api.bases.organization import OrganizationEndpoint
from sentry.guide import manager
from sentry.models import Group, Project, UserGuide, UserGuideStatus


class DugoutEndpoint(OrganizationEndpoint):
    permission_classes = (IsAuthenticated, )

    def get(self, request, organization):
        # if user has started, completed, or skipped a guide in the last day, return nothing.
        show_guide = True
        try:
            last_modified = UserGuide.objects.filter(
                user=request.user, organization=organization
            ).exclude(
                status=UserGuideStatus.QUEUED
            ).order_by('-last_modified')[0].last_modified
            show_guide = last_modified <= (timezone.now() - timedelta(days=1))
        except IndexError:
            pass

        extra_guides = []
        if show_guide:
            extra_guides = manager.exclude(
                list(UserGuide.objects.filter(
                    user=request.user, organization=organization, status=UserGuideStatus.SKIPPED
                ).values_list('slug', flat=True))
            )

        # always include queued
        project = Project.objects.order_by('-date_added').first()
        group = Group.objects.filter(project=project).first()
        queued_guide = UserGuide.objects.filter(
            user=request.user, organization=organization, status=UserGuideStatus.QUEUED
        ).first()

        if queued_guide:
            result = manager.get_by_slug(
                queued_guide.slug).to_dict(
                project=project,
                organization=organization,
                group=group)
        else:
            result = {}
        return Response(result)

    def put(self, request, organization):
        req = json.loads(request.body)

        assert req['status'] != 'queued'

        status = [c[0] for c in UserGuide.STATUS_CHOICES if c[1] == req['status']][0]

        UserGuide.objects.filter(
            user=request.user, organization=organization, slug=req['slug']
        ).update(status=status)

        return HttpResponse(201)
