from __future__ import absolute_import

# from django.core import mail
from django.core.urlresolvers import reverse

# from sentry.models import AuditLogEntry, AuditLogEntryEvent, OrganizationMember
from sentry.testutils import TestCase, PermissionTestCase


class Organization2FAPermissionTest(PermissionTestCase):
    def setUp(self):
        super(Organization2FAPermissionTest, self).setUp()
        owner = self.create_user()
        organization = self.create_organization(owner=owner)

        self.org_settings_path = reverse(
            'sentry-organization-member-settings', args=[self.organization.slug, owner.id]
        )
        self.org_path = reverse(
            'sentry-organization-home', args=[organization.slug]
        )
        # Add Members
        user1 = self.create_user(is_superuser=False)
        user2 = self.create_user(is_superuser=False)
        user3 = self.create_user(is_superuser=False)

        self.create_member(user=user1, organization=organization, role="member")
        self.create_member(user=user2, organization=organization, role="admin")
        self.create_member(user=user3, organization=organization, role="manager")

    def test_manager_member_can_load(self):
        self.assert_manager_can_access(self.org_settings_path)

    def test_non_compliant_member_cannot_load(self):
        self.assert_non_member_cannot_access(self.path)

    def test_compliant_member_can_load(self):
        self.assert_member_can_access(self.path)

    def test_compliant_member_remove_2FA_cannot_load(self):
        pass


class OrganizationSettingsTest(TestCase):
    def test_renders_with_context(self):
        pass
