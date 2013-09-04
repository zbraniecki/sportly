from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'gametracker.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^reporter/', include('reporter.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
