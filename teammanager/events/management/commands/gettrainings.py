from django.core.management.base import BaseCommand, CommandError

from urllib2 import Request, build_opener, HTTPCookieProcessor, HTTPHandler
import cookielib
import re

url = "http://4hands.mixxt.pl/"

login_form_url = re.compile('<form action="([^"]+)" method="post" class="niceform userloginForm clearfix">')

def get_login_form_url(html):
    m = login_form_url.search(html)
    return m.group(1)

def get_cookies():
    #Create a CookieJar object to hold the cookies
    cj = cookielib.CookieJar()
    #Create an opener to open pages using the http protocol and to process cookies.
    opener = build_opener(HTTPCookieProcessor(cj), HTTPHandler())

    #create a request object to be used to get the page.
    req = Request(url)
    f = opener.open(req)

    #see the first few lines of the page
    html = f.read()
    print(get_login_form_url(html))

    #Check out the cookies
    print "the cookies are: "
    for cookie in cj:
        print cookie

class Command(BaseCommand):

    def handle(self, *args, **options):
        get_cookies()
        self.stdout.write('Foo')
