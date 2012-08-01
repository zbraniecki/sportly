from django.conf.urls import patterns, include, url

urlpatterns = patterns('teammanager.views.views',
    url(r'^$', 'views.views', name='views'),
    url(r'^view/(?P<vid>\d+)$', 'views.view', name='view'),
    #url(r'teamactivity$', 'views.teamactivity', name='teamactivity'),
    #url(r'api/teamactivity/update$', 'actions.teamactivity'),

    url(r'^api/view_graph/(?P<vid>\d+)/data.json$', 'api.view_graph')
)

