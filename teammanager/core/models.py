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

class Team(models.Model):
    name = models.CharField(max_length=200)
    sport = models.ForeignKey(Sport)
    division = models.ForeignKey(Division, blank=True, null=True)
    parent = models.ForeignKey("Team", blank=True, null=True)
    roster = models.ManyToManyField(Person, blank=True, null=True)

    def __unicode__(self):
        if self.parent:
            return "%s / %s" % (self.parent.__unicode__(), self.name)
        return self.name

class Event(models.Model):
    name = models.CharField(max_length=200)
    startdate = models.DateField()
    starttime = models.TimeField(blank=True, null=True)
    enddate = models.DateField(blank=True, null=True)
    endtime = models.TimeField(blank=True, null=True)
    available_players = models.ManyToManyField(Person, null=True, blank=True)

    def __unicode__(self):
        return self.name

