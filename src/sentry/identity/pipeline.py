from __future__ import absolute_import, print_function

from django.core.urlresolvers import reverse

from sentry.utils.pipeline import ProviderPipeline

from . import default_manager


class IdentityProviderPipeline(ProviderPipeline):
    pipeline_name = 'identity_provider'
    provider_manager = default_manager

    def redirect_url(self):
        associate_url = reverse('sentry-account-associate-identity', args=[
            self.organization.slug,
            self.provider.key,
        ])

        # Use configured redirect_url if specified for the pipeline if available
        return self.config.get('redirect_url', associate_url)

    def finish_pipeline(self):
        # TODO: The pipeline should have already looked up the identity
        # provider model that's being used by this organization


#        # Create or update this users identity
#        idp, created = IdentityProvider.objects.get_or_create(
#            type=identity['type'],
#            instance=identity['instance'],
#        )
#
#
#
#
#
#
#        # Create the new integration
#        defaults = {
#            'metadata': data.get('metadata', {}),
#            'name': data.get('name', data['external_id']),
#        }
#        integration, created = Integration.objects.get_or_create(
#            provider=self.provider.key,
#            external_id=data['external_id'],
#            defaults=defaults
#        )
#        if not created:
#            integration.update(**defaults)
#        integration.add_organization(self.organization.id)
#
#        # Does this integration provide a user identity for the user setting up
#        # the integration?
#        identity = data.get('user_identity')
#
#        if identity:
#            # Create default identity provider if needed
#            idp, created = IdentityProvider.objects.get_or_create(
#                type=identity['type'],
#                instance=identity['instance'],
#            )
#
#            identity, created = Identity.objects.get_or_create(
#                idp=idp,
#                user=self.request.user,
#                external_id=identity['external_id'],
#                defaults={
#                    'status': IdentityStatus.VALID,
#                    'scopes': identity['scopes'],
#                    'data': identity['data'],
#                    'date_verified': timezone.now(),
#                },
#            )
#
#        return self._dialog_response(serialize(integration, self.request.user), True)
#



        # TODO: What happens when an identity pipeline completes??
        # self.stae.data has the bound identity
        raise NotImplementedError
