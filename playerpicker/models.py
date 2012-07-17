from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s %s' % (self.name, self.lastname)

class Event(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

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


'''
class Skill(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s' % self.name
'''


class View(models.Model):
    name = models.CharField(max_length=200)
    people = models.ManyToManyField(Person, through="ViewValue")
    formula = models.CharField(max_length=200, blank=True, null=True)

    def __unicode__(self):
        return '%s' % self.name

    def compute(self):
        pass

class ViewValue(models.Model):
    person = models.ForeignKey(Person)
    view = models.ForeignKey(View)
    value = models.IntegerField()

    def __unicode__(self):
        return u"%s \u2014 %s [%s]" % (self.person.__unicode__(),
                                      self.view.__unicode__(),
                                      self.value)

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
