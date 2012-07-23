from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from teammanager.core.models import Person, Team

class GameType(models.Model):
    """
    outdoor, indoor, beach
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Visibility(models.Model):
    """
    open - anyone can see it from any team etc.
    invite_only
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class EditionInvitation(models.Model):
    edition = models.ForeignKey("Edition")
    limit = models.Q(model = 'person') | models.Q(model = 'team')
    content_type = models.ForeignKey(ContentType, limit_choices_to = limit)
    object_id = models.PositiveIntegerField()
    invitee = generic.GenericForeignKey('content_type', 'object_id') # person or team

    def __unicode__(self):
        return "Invitation for %s to %s" % (self.invitee.__unicode__(),
                                            self.edition.__unicode__())

class EventTeamInvitation(models.Model):
    event_team = models.ForeignKey("EventTeam")
    invitee = models.ForeignKey(Person)

    def __unicode__(self):
        return "Invitation for %s to %s" % (self.invitee.__unicode__(),
                                            self.event_team.__unicode__())

class EventType(models.Model):
    """
    Season, League, Tournament, Sparring, Training etc.
    """
    name = models.CharField(max_length=200)
    parent = models.ForeignKey("EventType", blank=True, null=True)

    def __unicode__(self):
        if self.parent:
            return "%s > %s" % (self.parent.__unicode__(), self.name)
        return self.name

class Event(models.Model):
    """
    BBC, Sun Beam, Warzka
    """
    name = models.CharField(max_length=200)
    event_type = models.ForeignKey(EventType)
    game_type = models.ForeignKey(GameType)
    parent = models.ForeignKey("Event", blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    visibility = models.ForeignKey(Visibility)

    def __unicode__(self):
        return self.name

class Edition(models.Model):
    """
    Sun Beam 2012, Warzka 2012 etc.
    Same for WLU 2012 and WLU 2012 > Kolejka 1
    """
    name = models.CharField(max_length=200, blank=True, null=True)
    parent = models.ForeignKey("Edition", blank=True, null=True)
    event = models.ForeignKey(Event, blank=True, null=True)
    start_date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=200)
    visibility = models.ForeignKey(Visibility)

    def __unicode__(self):
        if self.name:
            name = self.name
        else:
            name = "(%s)" % self.start_date
        name = "%s %s" % (self.event.__unicode__(), name)
        if self.parent:
            return "%s > %s" % (self.parent.__unicode__(), name)
        return name

class SelectionType(models.Model):
    """
    open
    selective
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class EventTeam(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    event = models.ForeignKey(Edition, blank=True, null=True)
    team = models.ForeignKey(Team)
    selection_type = models.ForeignKey(SelectionType)
    players = models.ManyToManyField(Person,
                                     through="EventTeamPersonRole",
                                     blank=True,
                                     null=True)

    def __unicode__(self):
        if self.name:
            return "%s (%s)" % (self.name, self.event.__unicode__())
        return "%s (%s)" % (self.team.__unicode__(),
                            self.event.__unicode__())

class SignUpStatus(models.Model):
    """
    yes
    maybe
    no
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class TeamSignUp(models.Model):
    person = models.ForeignKey(Person)
    status = models.ForeignKey(SignUpStatus)
    event = models.ForeignKey(EventTeam)

    def __unicode__(self):
        return "Signup for %s for %s: %s" % (self.person.__unicode__(),
                                             self.event.__unicode__(),
                                             self.status.__unicode__())

class EditionSignUp(models.Model):
    limit = models.Q(model = 'person') | models.Q(model = 'team')
    content_type = models.ForeignKey(ContentType, limit_choices_to = limit)
    object_id = models.PositiveIntegerField()
    signee = generic.GenericForeignKey('content_type', 'object_id') # person or eventteam
    status = models.ForeignKey(SignUpStatus)
    edition = models.ForeignKey(Edition)

    def __unicode__(self):
        return "Signup for %s for %s: %s" % (self.signee.__unicode__(),
                                             self.edition.__unicode__(),
                                             self.status.__unicode__())

### Roles

class TeamRole(models.Model):
    """
    captain
    medic
    treasurer
    D-line captain
    """
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class EventTeamPersonRole(models.Model):
    person = models.ForeignKey(Person)
    eventteam = models.ForeignKey(EventTeam)
    roles = models.ManyToManyField(TeamRole)

    def __unicode__(self):
        return "%s at %s: %s" % (self.person.__unicode__(),
                                 self.eventteam.__unicode__(),
                                 ", ".join([i.__unicode__() for i in self.roles.all()]))


