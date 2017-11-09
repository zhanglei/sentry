from __future__ import absolute_import

from django.conf import settings
from django.db import models
from django.utils import timezone

from sentry.db.models import (
    BoundedPositiveIntegerField, FlexibleForeignKey, Model, sane_repr
)
from sentry.guide import manager
from sentry.models import Group


class GuideStep(object):
    def __init__(self, title, description, target):
        self.title = title
        self.description = description
        self.target = target

    def to_dict(self, **kwargs):
        if isinstance(self.target, str):
            target = self.target.format(**kwargs)
        else:
            target = kwargs['group'].qualified_short_id
        return {
            'title': self.title.format(**kwargs),
            'description': self.description.format(**kwargs),
            'target': target,
        }

# {
#     title: 'A better issue resolution flow',
#     description: 'Once you attach release to your Raven client, you\'ll be able to set an issue as resolved in the next release.',
#     target: 'issue-resolve-drop-down',
# },
# {
#     title: 'Better issue context',
#     description: 'Release data will also show up here.',
#     target: 'issue-sidebar-release-info',
# }

manager.add(slug='setup-release-tracking',
            starting_message='You sent your first Python event! Learn what to do next.',
            complete_message='Go to docs.sentry.io/learn/releases to learn more.',
            steps=[
                GuideStep('Don\'t get alerts for issues you\'ve fixed.',
                          'Setting up release tracking lets you mark issues as "Resolved in next release". Open your first issue to learn.',
                          Group.qualified_short_id),
                # GuideStep('Great! Now navigate to the Overview section',
                #           'Project Settings is where you configure your \
                #           {project.platform_name} project.',
                #           'a[href="/sentry/earth/dashboard/"]'),
                # GuideStep('Amazing! Now Click on the 1 hour filter',
                #           'Project Settings is where you configure your \
                #           {project.platform_name} project.',
                #           'a[href="/sentry/earth/dashboard/?statsPeriod=1h"]'),
            ])


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
