from django.core.management.base import BaseCommand, CommandError

import urllib, urllib2, cookielib
#from urllib2 import Request, build_opener, HTTPCookieProcessor, HTTPHandler
#import cookielib
import re

url = "http://4hands.mixxt.pl/"

username = 'gandii'
password = 'lomtjjz'

login_form_url = re.compile('<form action="([^"]+)" method="post" class="niceform userloginForm clearfix">')

def get_login_form_url(html):
    m = login_form_url.search(html)
    return m.group(1)

def login():
    cj = cookielib.CookieJar()
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
    f = opener.open(url)
    html = f.read()
    form = {'url': get_login_form_url(html),
            'login': username,
            'password': password}

    #Check out the cookies
    print "the cookies are: "
    for cookie in cj:
        print cookie

    login_data = urllib.urlencode({'mixxtID': form['login'],
                                    'password': form['password'],
                                    'generateAuthToken': 1,
                                    'login_login': 'Zaloguj'})
    opener.open('%s%s' % (url, form['url']), login_data)

    resp = opener.open(url)
    print(resp.read())
    
    

class Command(BaseCommand):

    def handle(self, *args, **options):
        login()
        self.stdout.write('Foo')
