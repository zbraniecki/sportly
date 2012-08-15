# coding=utf-8

from django.core.management.base import BaseCommand, CommandError

import urllib, urllib2, cookielib
#from urllib2 import Request, build_opener, HTTPCookieProcessor, HTTPHandler
#import cookielib
import re

url = "http://4hands.mixxt.pl/"

username = 'gandii'
password = 'lomtjjz'

login_form_url = re.compile('<form action="([^"]+)" method="post" class="niceform userloginForm clearfix">')
events_link = re.compile('<h1><a href="(/networks/events/show_event.[0-9]+)"\s*(?:title=".*?")?>(.*?)</a></h1>')
archive_pages = re.compile('<li cass="arrow_right"><a href="/networks/events/archive.([0-9]+)">&raquo;</a></li></ul>')
event_people_link = re.compile('<a href="(.*?)">(.*?)</a></li>')


def read_file(filename, charset='utf-8', errors='strict'):
    with open(filename, 'rb') as f:
        return f.read().decode(charset, errors)

cj = cookielib.CookieJar()

def get_login_form_url(html):
    m = login_form_url.search(html)
    return m.group(1)

def parse_archive_pages(html):
    res = archive_pages.search(html)
    return int(res.group(1))

def parse_events_page(html):
    events = []
    res = events_link.findall(html)
    for i in res:
        events.append({'url': i[0], 'name': i[1]})
    return events

def parse_event_page(html):
    event = {
        'name': None,
        'date': None,
        'place': None,
        'desc': None,
        'users': {
            'yes': [],
            'maybe': [],
            'no': []
        }
    }
    yes_pos = html.find(u'<h5>Wezmą udział:')
    maybe_pos = html.find(u'<h5>Zainteresowani')
    no_pos = html.find(u'<h5>Nie wezmą udziału')
    end_ul = html.find('</ul>', no_pos)
    print(yes_pos)
    print(maybe_pos)
    print(no_pos)
    yes = event_people_link.findall(html, yes_pos, maybe_pos)
    maybe = event_people_link.findall(html, maybe_pos, no_pos)
    no = event_people_link.findall(html, no_pos, end_ul)
    event['users']['yes'] = yes
    event['users']['maybe'] = maybe
    event['users']['no'] = no
    return event

def login():
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

def get_page(suburl):
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
    resp = opener.open('%s%s' % (url, suburl))
    html = resp.read()
    return html

def get_archive():
    events = []
    (events, pages) = get_archive_page(1, True)
    for i in range(2, pages+1):
        ev2 = get_archive_page(i)
        events.extend(ev2)
    cur_ev = get_current_events()
    events.extend(cur_ev)
    for i in events:
        print(i)

def get_current_events():
    index_url = "networks/events/index"
    events = get_events_page(index_url, get_pages=False)
    return events

def get_archive_page(num, get_pages=False):
    arch_url = "networks/events/archive.%s" % num
    return get_events_page(arch_url, get_pages=get_pages)

def get_events_page(suburl, get_pages=False):
    events = []
    html = get_page(suburl)
    if get_pages:
        pages = parse_archive_pages(html)
        events = parse_events_page(html)
        return (events, pages)
    else:
        events = parse_events_page(html)
        return events 

def get_event_page(suburl):
    #html - get_page(suburl)
    html = read_file('/Users/zbraniecki/Desktop/mixxt.html')
    event = parse_event_page(html)
    print(event)
    return event

class Command(BaseCommand):

    def handle(self, *args, **options):
        #login()
        #get_archive()
        get_event_page('/networks/events/show_event.65235')
        self.stdout.write('Foo')
