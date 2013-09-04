from django.conf.urls import patterns, url

from reporter.views import views, actions

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^api$', actions.addaction, name='addaction'),
)
