from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s %s' % (self.name, self.lastname)

class Skill(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return '%s' % self.name

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

