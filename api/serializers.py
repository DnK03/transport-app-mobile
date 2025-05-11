from rest_framework import serializers
from .models import User, Driver, Ride
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'is_driver', 'first_name', 'last_name')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'phone', 'is_driver', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Parolele nu se potrivesc."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class DriverSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Driver
        fields = ('id', 'user', 'license_number', 'car_model', 'car_plate', 'rating', 'is_available')

class RideSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    driver = DriverSerializer(read_only=True)

    class Meta:
        model = Ride
        fields = '__all__'
        read_only_fields = ('price', 'status', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Calculare preț bazat pe distanță
        distance = validated_data.get('distance_km')
        # Formula de preț: 5 lei bază + 2.5 lei per km
        price = 5 + (distance * 2.5)
        validated_data['price'] = price
        return super().create(validated_data)