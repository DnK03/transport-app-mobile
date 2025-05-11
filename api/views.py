from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Driver, Ride
from .serializers import UserSerializer, UserRegistrationSerializer, DriverSerializer, RideSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def available(self, request):
        drivers = Driver.objects.filter(is_available=True)
        serializer = self.get_serializer(drivers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        try:
            driver = Driver.objects.get(user=request.user)
        except Driver.DoesNotExist:
            return Response({"error": "Profilul de șofer nu există."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PATCH':
            serializer = self.get_serializer(driver, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:
            serializer = self.get_serializer(driver)

        return Response(serializer.data)

class RideViewSet(viewsets.ModelViewSet):
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_driver:
            try:
                driver = Driver.objects.get(user=user)
                return Ride.objects.filter(driver=driver)
            except Driver.DoesNotExist:
                return Ride.objects.none()
        return Ride.objects.filter(client=user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=True, methods=['post'])
    def accept_ride(self, request, pk=None):
        ride = self.get_object()
        user = request.user

        if not user.is_driver:
            return Response({"error": "Doar șoferii pot accepta curse."}, status=status.HTTP_403_FORBIDDEN)

        try:
            driver = Driver.objects.get(user=user)
        except Driver.DoesNotExist:
            return Response({"error": "Profilul de șofer nu există."}, status=status.HTTP_400_BAD_REQUEST)

        if ride.status != 'requested':
            return Response({"error": "Această cursă nu poate fi acceptată."}, status=status.HTTP_400_BAD_REQUEST)

        ride.driver = driver
        ride.status = 'accepted'
        ride.save()

        serializer = self.get_serializer(ride)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def start_ride(self, request, pk=None):
        ride = self.get_object()

        if ride.status != 'accepted':
            return Response({"error": "Această cursă nu poate fi începută."}, status=status.HTTP_400_BAD_REQUEST)

        ride.status = 'in_progress'
        ride.save()

        serializer = self.get_serializer(ride)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete_ride(self, request, pk=None):
        ride = self.get_object()

        if ride.status != 'in_progress':
            return Response({"error": "Această cursă nu poate fi finalizată."}, status=status.HTTP_400_BAD_REQUEST)

        ride.status = 'completed'
        ride.save()

        serializer = self.get_serializer(ride)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel_ride(self, request, pk=None):
        ride = self.get_object()

        if ride.status in ['completed', 'cancelled']:
            return Response({"error": "Această cursă nu poate fi anulată."}, status=status.HTTP_400_BAD_REQUEST)

        ride.status = 'cancelled'
        ride.save()

        serializer = self.get_serializer(ride)
        return Response(serializer.data)