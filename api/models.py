from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator

class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)
    is_driver = models.BooleanField(default=False)

    class Meta:
        swappable = 'AUTH_USER_MODEL'

    def __str__(self):
        return self.username

class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    license_number = models.CharField(max_length=20)
    car_model = models.CharField(max_length=50)
    car_plate = models.CharField(max_length=10)
    rating = models.FloatField(default=5.0)
    is_available = models.BooleanField(default=False)

    def __str__(self):
        return f"Driver: {self.user.username}"

class Ride(models.Model):
    STATUS_CHOICES = (
        ('requested', 'Requested'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_rides')
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='driver_rides', null=True, blank=True)
    pickup_location = models.CharField(max_length=255)
    pickup_lat = models.FloatField()
    pickup_lng = models.FloatField()
    dropoff_location = models.CharField(max_length=255)
    dropoff_lat = models.FloatField()
    dropoff_lng = models.FloatField()
    distance_km = models.FloatField(validators=[MinValueValidator(0.1)])
    price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ride #{self.id}: {self.client.username} - {self.status}"