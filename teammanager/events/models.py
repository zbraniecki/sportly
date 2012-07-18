from django.db import models
from teammanager.core.models import Event, Person

class Training(Event):
    location = models.CharField(max_length=200)


class Tournament(Event):
    location = models.CharField(max_length=200)
    roster = models.ManyToManyField(Person, blank=True, null=True)

