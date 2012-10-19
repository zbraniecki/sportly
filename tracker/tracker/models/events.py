from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from tracker.models.core import TrackerModel, Person, Team, Unit, Division, Role


class EventFieldType(TrackerModel):
    """
    outdoor, indoor, beach
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class EventType(TrackerModel):
    """
    Season, League, Tournament, Sparring, Training etc.
    """
    name = models.CharField(max_length=200)
    parent = models.ForeignKey("EventType", blank=True, null=True)

    def __unicode__(self):
        if self.parent:
            return "%s > %s" % (self.parent.__unicode__(), self.name)
        return self.name

class EventVisibility(TrackerModel):
    """
    open - anyone can see it from any team etc.
    invite_only
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Series(TrackerModel):
    """
    BBC, Sun Beam, Warzka
    """
    name = models.CharField(max_length=200)
    event_type = models.ForeignKey(EventType)
    field_type = models.ForeignKey(EventFieldType)
    parent = models.ForeignKey("Series", blank=True, null=True)
    location = models.TextField(max_length=200, blank=True, null=True)
    visibility = models.ForeignKey(EventVisibility)
    organizer = models.ForeignKey(Unit, blank=True, null=True)

    def __unicode__(self):
        return self.name

class Event(TrackerModel):
    """
    Sun Beam 2012, Warzka 2012 etc.
    Same for WLU 2012 and WLU 2012 > Kolejka 1
    """
    name = models.CharField(max_length=200, blank=True, null=True)
    parent = models.ForeignKey("Event", blank=True, null=True)
    series = models.ForeignKey(Series, blank=True, null=True)
    event_type = models.ForeignKey(EventType, blank=True, null=True)
    field_type = models.ForeignKey(EventFieldType, blank=True, null=True)
    start_date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    location = models.TextField(max_length=200)
    visibility = models.ForeignKey(EventVisibility)
    organizer = models.ForeignKey(Unit, blank=True, null=True)

    def __unicode__(self):
        if self.name:
            name = self.name
        else:
            name = "(%s)" % self.start_date
        if self.series:
            name = "%s %s" % (self.series.__unicode__(), name)
        if self.parent:
            return "%s > %s" % (self.parent.__unicode__(), name)
        return name

    def short_name(self):
        if self.name:
            name = self.name
        else:
            name = "(%s)" % self.start_date
        if self.event:
            return "%s %s" % (self.series.name, name)
        return name

class EventDivision(TrackerModel):
    event = models.ForeignKey(Event, related_name="divisions")
    division = models.ForeignKey(Division)

    def __unicode__(self):
        return '%s, %s' % (self.event.__unicode__(),
                           self.division.__unicode__())

    def squads(self):
        signups = EventDivisionSignUp.objects.filter(event_division=self,
                                                     status__name="yes")
        squads = []
        for signup in signups:
            squads.append(signup.signee)
        return squads

class SquadSelectionType(TrackerModel):
    """
    open
    selective
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Roster(TrackerModel):
    name = models.CharField(max_length=200, blank=True, null=True)
    event_division = models.ForeignKey(EventDivision, blank=True, null=True)
    team = models.ManyToManyField(Team)
    selection_type = models.ForeignKey(SquadSelectionType)

    def __unicode__(self):
        if self.name:
            return "%s (%s)" % (self.name, self.event_division.__unicode__())
        return "%s (%s)" % (self.team.get().__unicode__(),
                            self.event_division.__unicode__())

    def team_name(self):
        if self.name:
            return self.name
        return self.team.get().__unicode__()

    def players(self):
        if self.selection_type.name == 'selective':
            return self.person_roles.all()
        players = []
        for su in self.signups.filter(status__name="yes"):
            players.append(su.person)
        return players

    def yes_players(self):
        return self.signups.filter(status__name="yes") 

    def maybe_players(self):
        return self.signups.filter(status__name="maybe") 

    def no_players(self):
        return self.signups.filter(status__name="no") 

# Signups

class EventDivisionInvitation(TrackerModel):
    # Usually you will invite the whole team
    # but sometimes you may have a hat or a tournament where you invite
    # particular players
    #
    # On top of that, you may want to invite selected players to a training
    event_division = models.ForeignKey("EventDivision")
    limit = models.Q(model = 'person') | models.Q(model = 'team')
    content_type = models.ForeignKey(ContentType, limit_choices_to = limit)
    object_id = models.PositiveIntegerField()
    invitee = generic.GenericForeignKey('content_type', 'object_id') # person or team

    def __unicode__(self):
        return "Invitation for %s to %s" % (self.invitee.__unicode__(),
                                            self.edition_division.__unicode__())

class RosterInvitation(TrackerModel):
    # You may invite people to roster
    squad = models.ForeignKey(Roster)
    invitee = models.ForeignKey(Person)

    def __unicode__(self):
        return "Invitation for %s to %s" % (self.invitee.__unicode__(),
                                            self.squad.__unicode__())

class SignUpStatus(TrackerModel):
    # This is a status of someone or a team signing up for something
    """
    yes
    maybe
    no
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class AcceptedStatus(TrackerModel):
    # This is a status of someone or a team being accepted for something
    """
    yes
    maybe
    no
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class RosterSignUp(TrackerModel):
    # This is a status of a person signing up for a squad
    person = models.ForeignKey(Person)
    status = models.ForeignKey(SignUpStatus)
    squad = models.ForeignKey(Roster, related_name="signups")

    def __unicode__(self):
        return "Signup for %s for %s: %s" % (self.person.__unicode__(),
                                             self.squad.__unicode__(),
                                             self.status.__unicode__())

class EventDivisionSignUp(TrackerModel):
    # This is a status of a person or a squad signing up for an event
    limit = models.Q(model = 'person') | models.Q(model = 'roster')
    content_type = models.ForeignKey(ContentType, limit_choices_to = limit)
    object_id = models.PositiveIntegerField()
    signee = generic.GenericForeignKey('content_type', 'object_id') # person or squad
    status = models.ForeignKey(SignUpStatus)
    accepted = models.ForeignKey(AcceptedStatus, blank=True, null=True)
    seed = models.IntegerField(blank=True, null=True)
    event_division = models.ForeignKey(EventDivision, related_name="signups")

    def __unicode__(self):
        if not self.signee:
            return "Signup"
        return "Signup for %s for %s: %s" % (self.signee.__unicode__(),
                                             self.event_division.__unicode__(),
                                             self.status.__unicode__())
### Roles

class RosterPersonRole(TrackerModel):
    person = models.ForeignKey(Person)
    roster = models.ForeignKey(Roster, related_name="roles")
    roles = models.ManyToManyField(Role)

    def __unicode__(self):
        return "%s at %s: %s" % (self.person.__unicode__(),
                                 self.roster.__unicode__(),
                                 ", ".join([i.__unicode__() for i in self.roles.all()]))


