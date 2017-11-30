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
        # TODO: What happens when an identity pipeline completes??
        # self.stae.data has the bound identity
        raise NotImplementedError
