from django.db import models
import datetime

#### Helpers #######


class DatedManager(models.Manager):
    def for_date(self, date):
        return (self.filter(models.Q(start__lte=date) |
                            models.Q(start__isnull=True))
                .filter(models.Q(end__gt=date) |
                        models.Q(end__isnull=True)))

    def current(self):
        return self.for_date(datetime.datetime.utcnow())


class DurationThrough(models.Model):
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)
    objects = DatedManager()
    unique = ('start', 'end')

    class Meta:
        abstract = True

    class DurationMeta:
        get_latest_by = 'start'
        ordering = ['-start', '-end']


class TimePointManager(models.Manager):
    def for_date(self, date):
        return self.filter(timepoint__lte=date).order_by('-timepoint')[0]

    def latest(self):
        return self.for_date(datetime.datetime.utcnow())

class TimePointModel(models.Model):
    timepoint = models.DateTimeField(default=datetime.datetime.utcnow)
    objects = TimePointManager()
    unique = ('timepoint')

    class Meta:
        abstract = True

####################


class Person(models.Model):
    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s %s' % (self.name, self.lastname)
'''
class Event(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

class Skill(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s' % self.name
'''


class View(models.Model):
    name = models.CharField(max_length=200)
    people = models.ManyToManyField(Person, through="ViewAvailability")

    def current_people(self):
        return [va.person for va in ViewAvailability.objects.current().filter(view=self)]

    def current_values(self):
        pass
        #return ViewValue.objects.filter(view=self).

    def __unicode__(self):
        return '%s' % self.name

class ViewValue(TimePointModel):
    person = models.ForeignKey(Person)
    view = models.ForeignKey(View)
    value = models.IntegerField()

    def __unicode__(self):
        return u"%s \u2014 %s \u2014 %s [%s]" % (self.person.__unicode__(),
                                      self.view.__unicode__(),
                                      self.value,
                                      str(self.timepoint.date()))

class ViewAvailability(DurationThrough):
    person = models.ForeignKey(Person)
    view = models.ForeignKey(View)

    def __unicode__(self):
        rv = u'%s \u2014 %s' % (self.person.__unicode__(),
                               self.view.__unicode__())
        if self.start or self.end:
            rv += u' [%s:%s]' % (
                self.start and str(self.start.date()) or '',
                self.end and str(self.end.date()) or '')
        return rv

    class Meta(DurationThrough.DurationMeta):
        unique_together = (DurationThrough.unique + ('person', 'view'),)

############################


'''
class Line(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s' % self.name

class Play(models.Model):
    name = models.CharField(max_length=200)
    line = models.ForeignKey(Line)

    def __unicode__(self):
        return '%s (%s)' % (self.name, self.line.name)

class Role(models.Model):
    name = models.CharField(max_length=200)
    components = models.ManyToManyField(Skill, blank=True, null=True)
    line = models.ForeignKey(Line)
    play = models.ForeignKey(Play, blank=True, null=True)

    def __unicode__(self):
        desc = [self.line.name]
        if self.play:
            desc.append(self.play.name)
        return '%s (%s)' % (self.name,
                            ', '.join(desc))

class PlayerSkill(models.Model):
    player = models.ForeignKey(Player)
    skill = models.ForeignKey(Skill)
    value = models.IntegerField()
    datetime = models.DateTimeField()

    def __unicode__(self):
        return '%s, %s, %s: %s' % (self.player.__unicode__(),
                            self.skill.name,
                            str(self.datetime)[:-6], #fugly
                            self.value)

class Test(models.Model):
    name = models.CharField(max_length=200)
    skills = models.ManyToManyField(Skill)
    units = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s (%s)' % (self.name,
                            ','.join([skill.name for skill in self.skills.all()]))

class TestResult(models.Model):
    test = models.ForeignKey(Test)
    datetime = models.DateTimeField()
    player = models.ForeignKey(Player)
    result = models.IntegerField()

    def __unicode__(self):
        return '%s, %s, %s: %s%s' % (self.player.__unicode__(),
                               self.test.name,
                               str(self.datetime)[:-6],  # fugly
                               self.result,
                               self.test.units)

class TeamActivity(models.Model):
    player= models.ForeignKey(Player)
    value = models.IntegerField()

    def __unicode__(self):
        return '%s (%d)' % (self.player.__unicode__(), self.value)
'''
