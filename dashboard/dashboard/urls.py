from django.conf.urls import patterns, include, url
from django.conf import settings

urlpatterns = patterns('dashboard.views.views',
    url(r'^$', 'index'),
    url(r'^edition/(?P<eid>\d+)$', 'edition'),
    url(r'^division/(?P<edid>\d+)$', 'division'),
    url(r'^phase/(?P<pid>\d+)$', 'phase'),
    url(r'^group/(?P<gid>\d+)$', 'group'),
    url(r'^game/(?P<gid>\d+)$', 'game'),
    url(r'^planner/', 'planner'),
)

urlpatterns += patterns('dashboard.views.api',
    url(r'^api/bracket/(?P<gid>\d+)$', 'bracket'),
    url(r'^api/planner/event/(?P<eid>\d+)$', 'event'),
)

if settings.DEBUG:
    urlpatterns = patterns('',
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    url(r'', include('django.contrib.staticfiles.urls')),
) + urlpatterns
