from django.conf.urls import patterns, url

from reporter.views import views, actions, api

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^api/get_game$', api.get_game, name='get_game'),
    url(r'^api/add_moment$', actions.add_moment, name='add_moment'),
    url(r'^api/remove_moment$', actions.remove_moment, name='remove_moment'),
)
