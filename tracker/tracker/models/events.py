from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from tracker.models.core import TrackerModel, Person, Team, Division


class EventGameType(TrackerModel):
    """
    outdoor, indoor, beach
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Visibility(TrackerModel):
    """
    open - anyone can see it from any team etc.
    invite_only
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class EditionDivisionInvitation(TrackerModel):
    edition_division = models.ForeignKey("EditionDivision")
    limit = models.Q(model = 'person') | models.Q(model = 'team')
    content_type = models.ForeignKey(ContentType, limit_choices_to = limit)
    object_id = models.PositiveIntegerField()
    invitee = generic.GenericForeignKey('content_type', 'object_id') # person or team

    def __unicode__(self):
        return "Invitation for %s to %s" % (self.invitee.__unicode__(),
                                            self.edition_division.__unicode__())

class SquadInvitation(TrackerModel):
    squad = models.ForeignKey("Squad")
    invitee = models.ForeignKey(Person)

    def __unicode__(self):
        return "Invitation for %s to %s" % (self.invitee.__unicode__(),
                                            self.squad.__unicode__())

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

# Event -> Series
# Edition -> Event ?
class Event(TrackerModel):
    """
    BBC, Sun Beam, Warzka
    """
    name = models.CharField(max_length=200)
    event_type = models.ForeignKey(EventType)
    game_type = models.ForeignKey(EventGameType)
    parent = models.ForeignKey("Event", blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    visibility = models.ForeignKey(Visibility)
    organizer = models.ForeignKey(Team, blank=True, null=True)

    def __unicode__(self):
        return self.name

class Edition(TrackerModel):
    """
    Sun Beam 2012, Warzka 2012 etc.
    Same for WLU 2012 and WLU 2012 > Kolejka 1
    """
    name = models.CharField(max_length=200, blank=True, null=True)
    parent = models.ForeignKey("Edition", blank=True, null=True)
    event = models.ForeignKey(Event, blank=True, null=True)
    #event_type = models.ForeignKey(EventType, blank=True, null=True)
    start_date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    # TextField ?
    location = models.CharField(max_length=200)
    visibility = models.ForeignKey(Visibility)
    organizer = models.ForeignKey(Team, blank=True, null=True)

    def __unicode__(self):
        if self.name:
            name = self.name
        else:
            name = "(%s)" % self.start_date
        if self.event:
            name = "%s %s" % (self.event.__unicode__(), name)
        if self.parent:
            return "%s > %s" % (self.parent.__unicode__(), name)
        return name

    def short_name(self):
        if self.name:
            name = self.name
        else:
            name = "(%s)" % self.start_date
        if self.event:
            return "%s %s" % (self.event.name, name)
        return name


class EditionDivision(TrackerModel):
    edition = models.ForeignKey(Edition, related_name="divisions")
    division = models.ForeignKey(Division)

    def __unicode__(self):
        return '%s, %s' % (self.edition.__unicode__(),
                           self.division.__unicode__())

    def squads(self):
        signups = EditionDivisionSignUp.objects.filter(edition_division=self,
                                               status__name="yes")
        squads = []
        for signup in signups:
            squads.append(signup.signee)
        return squads

class SelectionType(TrackerModel):
    """
    open
    selective
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Squad(TrackerModel):
    name = models.CharField(max_length=200, blank=True, null=True)
    edition_division = models.ForeignKey(EditionDivision, blank=True, null=True)
    team = models.ManyToManyField(Team)
    selection_type = models.ForeignKey(SelectionType)
    person_roles = models.ManyToManyField(Person,
                                          through="SquadPersonRole",
                                          blank=True,
                                          null=True)

    def __unicode__(self):
        if self.name:
            return "%s (%s)" % (self.name, self.edition_division.__unicode__())
        return "%s (%s)" % (self.team.get().__unicode__(),
                            self.edition_division.__unicode__())

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


class SignUpStatus(TrackerModel):
    """
    yes
    maybe
    no
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class AcceptedStatus(TrackerModel):
    """
    yes
    maybe
    no
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class SquadSignUp(TrackerModel):
    person = models.ForeignKey(Person)
    status = models.ForeignKey(SignUpStatus)
    squad = models.ForeignKey(Squad, related_name="signups")

    def __unicode__(self):
        return "Signup for %s for %s: %s" % (self.person.__unicode__(),
                                             self.squad.__unicode__(),
                                             self.status.__unicode__())

class EditionDivisionSignUp(TrackerModel):
    limit = models.Q(model = 'person') | models.Q(model = 'squad')
    content_type = models.ForeignKey(ContentType, limit_choices_to = limit)
    object_id = models.PositiveIntegerField()
    signee = generic.GenericForeignKey('content_type', 'object_id') # person or squad
    status = models.ForeignKey(SignUpStatus)
    accepted = models.ForeignKey(AcceptedStatus, blank=True, null=True)
    # seed = models.IntegerField(blank=True, null=True)
    edition_division = models.ForeignKey(EditionDivision, related_name="signups")

    def __unicode__(self):
        if not self.signee:
            return "Signup"
        return "Signup for %s for %s: %s" % (self.signee.__unicode__(),
                                             self.edition_division.__unicode__(),
                                             self.status.__unicode__())

# Buckets

class Bucket(TrackerModel):
    class Meta:
        ordering = ['pos']
        app_label = 'tracker'

    name = models.CharField(max_length=200, blank=True, null=True)
    code_name = models.CharField(max_length=200, blank=True, null=True)
    pos = models.IntegerField(blank=True, null=True)
    edition_division = models.ForeignKey(EditionDivision)
    squads = models.ManyToManyField(Squad,
                                    through="BucketSquads",
                                    blank=True,
                                    null=True)

    def __unicode__(self):
        return '%s (%s)' % (self.name, self.code_name)

class BucketSquads(TrackerModel):
    class Meta:
        ordering = ['pos']
        app_label = 'tracker'
    
    squad = models.ForeignKey(Squad)
    bucket = models.ForeignKey(Bucket)
    pos = models.IntegerField(blank=True, null=True)

    def __unicode__(self):
        return "%s in bucket %s" % (self.squad,
                                    self.bucket)

### Roles

class TeamRole(TrackerModel):
    """
    captain
    medic
    treasurer
    D-line captain
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class SquadPersonRole(TrackerModel):
    person = models.ForeignKey(Person)
    squad = models.ForeignKey(Squad)
    roles = models.ManyToManyField(TeamRole)

    def __unicode__(self):
        return "%s at %s: %s" % (self.person.__unicode__(),
                                 self.squad.__unicode__(),
                                 ", ".join([i.__unicode__() for i in self.roles.all()]))


