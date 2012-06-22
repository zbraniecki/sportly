from django.conf.urls import patterns, include, url

urlpatterns = patterns('playerpicker.views',
    # Examples:
    url(r'^$', 'views.skills', name='skills'),
    url(r'teamactivity$', 'views.teamactivity', name='teamactivity'),
    url(r'api/teamactivity/update$', 'actions.teamactivity'),
)

