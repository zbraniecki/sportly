from django.db import models
from teammanager.views.utils import compile_formula, compute_expr
from teammanager.events.models import Event, Roster, Person



class View(models.Model):
    name = models.CharField(max_length=200)
    people = models.ManyToManyField(Person, through="ViewValue")
    event = models.ForeignKey(Event, blank=True, null=True)
    formula = models.CharField(max_length=200, blank=True, null=True)
    views = models.ManyToManyField("View", blank=True, null=True)

    def __unicode__(self):
        return '%s (V%s)' % (self.name, self.pk)

    def value(self, pid):
        try:
            vw = ViewValue.objects.get(view=self, person=pid)
            return vw.value
        except ViewValue.DoesNotExist:
            return None

    @property
    def people(self):
        if self.event:
            return Roster.objects.get(event=self.event).players.all()
        return Person.objects.all()

    @property
    def people_with_values(self):
        players = self.people
        vwl = ViewValue.objects.filter(view=self)
        for player in players:
            try:
                player.value = vwl.get(person=player).value
            except ViewValue.DoesNotExist:
                player.value = None
        return players

    def compute_value(self, person):
        exp = compile_formula(self, self.formula)
        val = compute_expr(self, exp.value, person=person)
        return val

    def compute_values(self):
        people = self.people
        vwl = ViewValue.objects.filter(view=self)
        for person in people:
            value = self.compute_value(person)
            try:
                vw = vwl.get(person=person)
                vw.value = value
            except ViewValue.DoesNotExist:
                vw = ViewValue(person=person,
                               view=self,
                               value=value)
            vw.save()
        

class ViewValue(models.Model):
    person = models.ForeignKey(Person)
    view = models.ForeignKey(View)
    value = models.FloatField()

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
