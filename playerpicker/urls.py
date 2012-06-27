from django.conf.urls import patterns, include, url

urlpatterns = patterns('playerpicker.views',
    # Examples:
    url(r'^$', 'views.view', name='view'),
    url(r'teamactivity$', 'views.teamactivity', name='teamactivity'),
    url(r'api/teamactivity/update$', 'actions.teamactivity'),
)

