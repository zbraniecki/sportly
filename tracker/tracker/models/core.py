from django.db import models
from django.contrib.auth.models import User
from django_countries import CountryField

class TrackerModel(models.Model):
    class Meta:
        abstract = True
        app_label = 'tracker'

class PositionalModel(models.Model):
    class Meta:
        abstract = True
        app_label = 'tracker'
        ordering = ['pos']

    pos = models.IntegerField(blank=True, null=True)

class Person(TrackerModel):
    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)
    user = models.ForeignKey(User, blank=True, null=True)

    def __str__(self):
        return '%s %s' % (self.name, self.lastname)

class Sport(TrackerModel):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Division(TrackerModel):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Unit(TrackerModel):
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return self.name

class Body(Unit):
    country = CountryField(blank=True, null=True)

class Club(Unit):
    country = CountryField(blank=True, null=True)

class Team(TrackerModel):
    club = models.ForeignKey(Club, blank=True, null=True)
    name = models.CharField(max_length=200)
    sport = models.ForeignKey(Sport)
    division = models.ForeignKey(Division, blank=True, null=True)

    def __str__(self):
        return self.name

class RoleType(TrackerModel):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Role(TrackerModel):
    """
    captain
    medic
    treasurer
    D-line captain
    """
    name = models.CharField(max_length=200)
    role_type = models.ForeignKey(RoleType)

    def __str__(self):
        return self.name
