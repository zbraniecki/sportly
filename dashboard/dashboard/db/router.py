class TrackerRouter(object):
    apps = [
        'tracker',
    ]
    """A router to control all database operations on models in
    the tracker application"""

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.apps:
            return 'tracker'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.apps:
            return None
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label in self.apps or obj2._meta.app_label == self.apps:
            return True
        return None

    def allow_syncdb(self, db, model):
        if db == 'tracker':
            return model._meta.app_label in self.apps
        elif model._meta.app_label in self.apps:
            return False
        return None
