from __future__ import absolute_import


class Guide(object):
    def __init__(self, slug, starting_url, steps, required_context, complete):
        self.slug = slug
        self.starting_url = starting_url
        self.steps = steps
        self.required_context = required_context
        self.complete = complete

    def to_dict(self, **kwargs):
        assert set(self.required_context) <= set(kwargs)

        return {
            'slug': self.slug,
            'steps': [step.to_dict(**kwargs) for step in self.steps],
            'complete': self.complete,
        }


class GuideManager(object):
    def __init__(self):
        self._slugs = set()
        self._slug_registry = {}

    def add(self, slug, starting_url, steps, required_context, complete):
        feature = Guide(slug, starting_url, steps, required_context, complete)
        self._slug_registry[slug] = feature
        self._slugs.add(slug)

    def all(self):
        return [self._slug_registry[k] for k in self._slug_registry]

    def get_by_slug(self, slug):
        return self._slug_registry[slug]

    def exclude(self, slugs):
        return [self._slug_registry[slug] for slug in self._slug_registry if slug not in slugs]
