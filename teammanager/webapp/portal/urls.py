from django.conf.urls import patterns, include, url

urlpatterns = patterns('teammanager.webapp.portal.views',
    url(r'^$', 'index'),
    url(r'^events/(?P<eid>\d+)$', 'event'),
)


urlpatterns += patterns('teammanager.webapp.portal.api',
    url(r'^api/authenticate$', 'authenticate'),
    url(r'^api/events/(?P<eid>\d+)/signup/(?P<dec>\w+)$', 'event_signup'),
    url(r'^api/events$', 'events'),
)
