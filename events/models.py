from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=200)
    startdate = models.DateField()
    starttime = models.TimeField(blank=True, null=True)
    enddate = models.DateField(blank=True, null=True)
    endtime = models.TimeField(blank=True, null=True)

    def __unicode__(self):
        return self.name

class Training(Event):
    location = models.CharField(max_length=200)

class Tournament(Event):
    location = models.CharField(max_length=200)

