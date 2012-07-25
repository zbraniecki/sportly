from django.conf.urls import patterns, include, url

urlpatterns = patterns('teammanager.webapp.dashboard.views',
    url(r'^$', 'index'),
    url(r'^edition/(?P<eid>\d+)$', 'edition'),
    url(r'^game/(?P<gid>\d+)$', 'game'),
)
