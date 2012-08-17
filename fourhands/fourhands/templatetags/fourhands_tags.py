from django import template
from django.conf import settings

from tracker.models.core import Team
from tracker.models.events import Squad, EventType, Event, Edition, Division, EditionDivision

register = template.Library()

@register.simple_tag
def roster_table():
    team = Team.objects.get(name="4Hands")
    season = EventType.objects.get(name="Season")
    division = Division.objects.get(name="mixed")
    event = Event.objects.get(event_type=season)
    edition = Edition.objects.get(event=event)
    ed = EditionDivision.objects.get(division=division,
                         edition=edition)
    squad = Squad.objects.get(team=team,
                              edition_division=ed)
    trs = []
    players = squad.players_playing()
    for player in players:
        tr = """
  <tr>
    <td>8</td>
    <td><img src="%s8.jpg"/></td>
    <td>%s</td>
    <td>183 cm</td>
    <td>77 kg</td>
    <td>Nov 12, 1983</td>
    <td>28</td>
    <td>Warsaw, Poland</td>
    </tr>
""" % (settings.MEDIA_URL,
       player)
        trs.append(tr)
    return "".join(trs)

@register.simple_tag
def schedule_table():
    team = Team.objects.get(name="4Hands")
    squads = Squad.objects.filter(team=team)
    eds = []
    for squad in squads:
        if squad.edition_division.edition.event.event_type.name=='Season':
            continue
        eds.append(squad.edition_division)
    trs = []
    for ed in eds:
        tr = """
  <tr>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
    </tr>
""" % (ed.edition.start_date,
       ed.edition.short_name(),
       ed.edition.event.event_type.name,
       ed.division.name)
        trs.append(tr)
    return "".join(trs)


@register.simple_tag
def stats_table():
    team = Team.objects.get(name="4Hands")
    season = EventType.objects.get(name="Season")
    division = Division.objects.get(name="mixed")
    event = Event.objects.get(event_type=season)
    edition = Edition.objects.get(event=event)
    ed = EditionDivision.objects.get(division=division,
                         edition=edition)
    squad = Squad.objects.get(team=team,
                              edition_division=ed)
    trs = []
    players = squad.players_playing()
    for player in players:
        tr = """
  <tr>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
    <td>%s</td>
    </tr>
""" % (player.id,
       "",
       player,
       0,
       0,
       0,
       0)
        trs.append(tr)
    return "".join(trs)


