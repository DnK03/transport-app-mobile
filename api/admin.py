from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Driver, Ride

admin.site.register(User, UserAdmin)
admin.site.register(Driver)
admin.site.register(Ride)