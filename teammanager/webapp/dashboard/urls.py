from django.conf.urls import patterns, include, url

urlpatterns = patterns('teammanager.webapp.dashboard.views',
    url(r'^$', 'index'),
    url(r'^edition/(?P<eid>\d+)$', 'edition'),
    url(r'^division/(?P<edid>\d+)$', 'division'),
    url(r'^phase/(?P<pid>\d+)$', 'phase'),
    url(r'^group/(?P<gid>\d+)$', 'group'),
    url(r'^game/(?P<gid>\d+)$', 'game'),
)
