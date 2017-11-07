from __future__ import absolute_import

from django.conf import settings
from django.db import models
from django.utils import timezone

from sentry.db.models import (
    BoundedPositiveIntegerField, FlexibleForeignKey, Model, sane_repr
)
from sentry.guide import manager


class GuideStep(object):
    def __init__(self, title, description, target, event, complete=None):
        self.title = title
        self.description = description
        self.target = target
        self.event = event

    def to_dict(self, **kwargs):
        return {
            'title': self.title.format(**kwargs),
            'description': self.description.format(**kwargs),
            'target': self.target.format(**kwargs),
            'event': self.event,
        }


manager.add(slug='setup-release-tracking',
            starting_url=r'(?P<organization_slug>[^\/]+)/(?P<project_slug>[^\/]+)/',
            steps=[
                GuideStep('You sent your {project.platform_name} first event!',
                          'Silence alerts for issues you\'ve fixed. Set up release tracking \
                          to mark issues as "resolved in next release."',
                          '.btn.project-settings',
                          'click'),
                GuideStep('Click on Release Tracking',
                          'Project Settings is where you configure your \
                          {project.platform_name} project.',
                          '[href={organization.slug}/{project.slug}/settings/release-tracking/]',
                          'click'),
            ],
            complete='Done',
            required_context=['organization', 'project'])


class UserGuideStatus(object):
    QUEUED = 0
    STARTED = 1
    COMPLETED = 2
    SKIPPED = 3


class UserGuide(Model):
    __core__ = False

    STATUS_CHOICES = ((UserGuideStatus.QUEUED, 'queued'),
                      (UserGuideStatus.STARTED, 'started'),
                      (UserGuideStatus.COMPLETED, 'completed'),
                      (UserGuideStatus.SKIPPED, 'skipped'))

    slug = models.SlugField(unique=True)
    organization = FlexibleForeignKey('sentry.Organization')
    user = FlexibleForeignKey(settings.AUTH_USER_MODEL, null=False)
    status = BoundedPositiveIntegerField(choices=STATUS_CHOICES)

    started = models.DateTimeField(default=timezone.now)
    last_modified = models.DateTimeField(auto_now=True)

    __repr__ = sane_repr('organization', 'user', 'slug', 'status')

    class Meta:
        app_label = 'sentry'
        db_table = 'sentry_userguide'
        unique_together = (('organization', 'user', 'slug'), )
