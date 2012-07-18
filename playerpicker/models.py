from django.db import models
import ast

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
    event = models.ForeignKey(Event, blank=True, null=True)
    formula = models.CharField(max_length=200, blank=True, null=True)
    views = models.ManyToManyField("View", blank=True, null=True)

    def __unicode__(self):
        return '%s' % self.name

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

    def compute_expr(self, expr, person):
        if isinstance(expr, ast.Name):
            if expr.id.startswith('V'):
                view = View.objects.get(id=expr.id[1:])
                val = view.value(pid=person.id)
                if val is None:
                    return 0
                return val
            raise SyntaxError("Unknown name: %s" % expr.id)
        if isinstance(expr, ast.Num):
            return expr.n
        if isinstance(expr, ast.BinOp):
            left = self.compute_expr(expr.left, person=person)
            right = self.compute_expr(expr.right, person=person)
            if isinstance(expr.op, ast.Mult):
                return left*right
        raise SyntaxError("Unknown expr literal: %s" % type(expr))

    def compile_formula(self, fs):
        try:
            exp = ast.parse(fs)
        except SyntaxError:
            raise SyntaxError("Could not parse formula: %s" % fs)
        exp = exp.body[0]
        if not isinstance(exp, ast.Expr):
            raise SyntaxError()
        return exp


    def compute_value(self, person):
        exp = self.compile_formula(self.formula)
        val = self.compute_expr(exp.value, person=person)
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
