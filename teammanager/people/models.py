from django.db import models


class Person(models.Model):
    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s %s' % (self.name, self.lastname)


