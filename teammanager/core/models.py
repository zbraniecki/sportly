from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s %s' % (self.name, self.lastname)

class Sport(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Division(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class GameType(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class EventType(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey("EventType", blank=True, null=True)

    def __unicode__(self):
        if self.parent:
            return "%s > %s" % (self.parent.__unicode__(), self.name)
        return self.name

class Event(models.Model):
    name = models.CharField(max_length=200)
    event_type = models.ForeignKey(EventType)
    game_type = models.ForeignKey(GameType)
    parent = models.ForeignKey("Event", blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)

    def __unicode__(self):
        return self.name

class Edition(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    parent = models.ForeignKey("Edition", blank=True, null=True)
    event = models.ForeignKey(Event, blank=True, null=True)
    startdate = models.DateField()
    starttime = models.TimeField(blank=True, null=True)
    enddate = models.DateField(blank=True, null=True)
    endtime = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=200)
    players = models.ManyToManyField(Person,
                                     null=True,
                                     blank=True)

    def __unicode__(self):
        if self.name:
            name = self.name
        else:
            name = "(%s)" % self.startdate
        if self.parent:
            return "%s > %s" % (self.parent.__unicode__(), name)
        return "%s %s" % (self.event.__unicode__(), name)

class Team(models.Model):
    name = models.CharField(max_length=200)
    sport = models.ForeignKey(Sport)
    division = models.ForeignKey(Division, blank=True, null=True)
    parent = models.ForeignKey("Team", blank=True, null=True)

    def __unicode__(self):
        if self.parent:
            return "%s / %s" % (self.parent.__unicode__(), self.name)
        return self.name

class EventTeam(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    event = models.ForeignKey(Edition)
    team = models.ForeignKey(Team)
    players = models.ManyToManyField(Person,
                                     blank=True,
                                     null=True)

    def __unicode__(self):
        if self.name:
            return "%s (%s)" % (self.name, self.event.__unicode__())
        return "%s (%s)" % (self.team.__unicode__(),
                            self.event.__unicode__())

class TeamRole(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

