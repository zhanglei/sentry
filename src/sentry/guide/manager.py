from __future__ import absolute_import


class Guide(object):
    def __init__(self, slug, starting_message, complete_message, steps):
        self.slug = slug
        self.starting_message = starting_message
        self.complete_message = complete_message
        self.steps = steps

    def to_dict(self, **kwargs):
        return {
            'slug': self.slug,
            'starting_message': self.starting_message,
            'complete_message': self.complete_message,
            'steps': [step.to_dict(**kwargs) for step in self.steps],
        }


class GuideManager(object):
    def __init__(self):
        self._slugs = set()
        self._slug_registry = {}

    def add(self, slug, starting_message, complete_message, steps):
        feature = Guide(slug, starting_message, complete_message, steps)
        self._slug_registry[slug] = feature
        self._slugs.add(slug)

    def all(self):
        return [self._slug_registry[k] for k in self._slug_registry]

    def get_by_slug(self, slug):
        return self._slug_registry[slug]

    def exclude(self, slugs):
        return [self._slug_registry[slug] for slug in self._slug_registry if slug not in slugs]
