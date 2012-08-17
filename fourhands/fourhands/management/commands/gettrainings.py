# coding=utf-8

from django.core.management.base import BaseCommand, CommandError
from tracker.models import Visibility, Edition, EditionDivision, Division
from tracker.models import EditionDivisionSignUp, SignUpStatus, Person

import mixxt

pplmap = {
    'grayna.chlebick': ['Grażyna', 'Chlebicka'],
    'gandii': ['Zbigniew', 'Braniecki'],
    'magdalenat': ['Magdalena', 'Teperowska'],
    'katarzyna.sawicka': ['Katarzyna', 'Sawicka'],
    'antonen': ['Antoni', 'Moroz'],
    'yumnick': ['Adam', 'Małek'],
    'marcin.goss': ['Marcin', 'Goss'],
    'agata.chojnowska': ['Agata', 'Chojnowska'],
    'polatejro': ['Piotr', 'Polatowski'],
    'michele.c': ['Michele', 'Corbetta'],
    'zuzanna.cichowska': ['Zuzanna', 'Cichowska'],
    'discjoker': ['Jan', 'Kryciński'],
    'sylwia.wroblewska': ['Sylwia', 'Wróblewska'],
    'marcin.gecow': ['Marcin', 'Gecow'],
    'matylka.gasiorowska': ['Matylda', 'Gąsiorowska'],
    'ola123': ['Olga', 'Jankowska'],
    'ooskar': ['Oskar', 'Kozłowski'],
    'jesiu.szatanek': ['Ewa', 'Jesionek'],
    'ada.serafin': ['Ada', 'Serafin'],
    'klara.p': ['Klara', 'Piechowska'],
    'adam.kade': ['Adam', 'Kadenaci'],
    'piotr.szejko': ['Piotr', 'Szejko'],
    'adrian.sroka': ['Adrian', 'Sroka'],
    'dzwiedz-11': ['Michał', 'Kryciński'],
    'goosia': ['Małgorzata', 'Gajda'],
    'gouomb': ['Michał', 'Gołębiowski'],
    'justbob': ['Robert', 'Późniak'],
    'kuba.roziewicz': ['Jakub', 'Roziewicz'],
    'karolina.herbin': ['Karolina', 'Herbin'],

}

def signup_player(ed, player, status):
    pid = player[0][33:]
    if pid in pplmap:
        (p,c) = Person.objects.get_or_create(name=pplmap[pid][0],
                                             lastname=pplmap[pid][1])
        if c:
            p.save()
    else: 
        (p,c) = Person.objects.get_or_create(name=pid,
                                             lastname='')
        if c:
            p.save()
    s = EditionDivisionSignUp(edition_division=ed,
                              signee=p,
                              status=status)
    s.save()

def load_to_tracker(event):
    vis = Visibility.objects.get(name='open')
    div = Division.objects.get(name='mixed')
    e = Edition(name=event['name'],
                start_date=event['date']['start'].date(),
                visibility=vis)
    if event['date']['start'].time():
        e.start_time = event['date']['start'].time()
    if event['date']['end']:
        e.end_date = event['date']['end'].date()
        if event['date']['end'].time():
            e.end_time = event['date']['end'].time()
    if event['place']:
        e.location = event['place']
    e.save()
    ed = EditionDivision(edition=e,
                         division=div)
    ed.save()

    yes = SignUpStatus.objects.get(name='yes')
    no = SignUpStatus.objects.get(name='no')
    maybe = SignUpStatus.objects.get(name='maybe')

    for player in event['users']['yes']:
        signup_player(ed, player, yes)
    for player in event['users']['no']:
        signup_player(ed, player, no)
    for player in event['users']['maybe']:
        signup_player(ed, player, maybe)

class Command(BaseCommand):

    def handle(self, *args, **options):
        #login()
        #get_archive()
        mx = mixxt.Mixxt()
        mx.login()
        # should be ~100 events!
        evlinks = mx.get_archive()
        events = []
        for link in evlinks:
            events.append(mx.get_event_page(link['url']))
        #    print(link)
        for event in events:
            load_to_tracker(event)
        #    print(i)
        #event = mx.get_event_page('/networks/events/show_event.65239')
        #print(event)
        self.stdout.write('Foo')
