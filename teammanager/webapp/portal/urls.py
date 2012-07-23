from django.conf.urls import patterns, include, url

urlpatterns = patterns('teammanager.webapp.portal.views',
    url(r'^$', 'index'),
)


urlpatterns += patterns('teammanager.webapp.portal.api',
    url(r'^api/authenticate$', 'authenticate'),
)
