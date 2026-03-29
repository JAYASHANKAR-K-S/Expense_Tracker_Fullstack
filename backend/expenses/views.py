from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from .models import Category, Expense, Income, Budget, Wallet, Goal, UserProfile
from .serializers import CategorySerializer, ExpenseSerializer, IncomeSerializer, BudgetSerializer, WalletSerializer, GoalSerializer, UserSerializer, UserProfileSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return categories belonging to the logged-in user
        return Category.objects.filter(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')

class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user).order_by('-date')

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).order_by('-year', '-month')

class WalletViewSet(viewsets.ModelViewSet):
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user).order_by('-created_at')

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user).order_by('target_date')

class UserProfileView(generics.RetrieveUpdateAPIView):
    # Retrieve: Get User + Profile data
    # Update: Update User details + Profile details
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        # Create profile if not exists
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.request.user
        
        # Update User fields
        if 'first_name' in request.data: user.first_name = request.data['first_name']
        if 'last_name' in request.data: user.last_name = request.data['last_name']
        if 'email' in request.data: user.email = request.data['email']
        user.save()

        # Update Profile fields
        profile = user.profile
        if 'phone' in request.data: profile.phone = request.data['phone']
        if 'avatar_url' in request.data: profile.avatar_url = request.data['avatar_url']
        if 'monthly_budget' in request.data: profile.monthly_budget = request.data['monthly_budget']
        profile.save()

        return Response(UserSerializer(user).data)
