from __future__ import absolute_import

from .manager import GuideManager

manager = GuideManager()

add = manager.add
all = manager.all
get_by_slug = manager.get_by_slug
exclude = manager.exclude
