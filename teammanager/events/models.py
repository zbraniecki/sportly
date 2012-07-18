from django.db import models
from teammanager.people.models import Person

class Event(models.Model):
    name = models.CharField(max_length=200)
    startdate = models.DateField()
    starttime = models.TimeField(blank=True, null=True)
    enddate = models.DateField(blank=True, null=True)
    endtime = models.TimeField(blank=True, null=True)
    available_players = models.ManyToManyField(Person, null=True, blank=True)

    def __unicode__(self):
        return self.name

class Training(Event):
    location = models.CharField(max_length=200)

class Tournament(Event):
    location = models.CharField(max_length=200)



class Roster(models.Model):
    def default_roster_name(self):
        if self.event:
            return "Roster for %s" % self.event.name
        return "Default roster"
    
    name = models.CharField(max_length=200,
                            null=True,
                            blank=True)
    event = models.ForeignKey(Event, null=True, blank=True)
    players = models.ManyToManyField(Person, null=True, blank=True)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.default_roster_name()
        super(Roster, self).save(*args, **kwargs)

