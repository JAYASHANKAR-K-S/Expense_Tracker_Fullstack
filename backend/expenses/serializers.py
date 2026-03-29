from rest_framework import serializers
from .models import Category, Expense, Income, Budget, Wallet, Goal, UserProfile
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
    def create(self, validated_data):
        # Automatically assign the logged-in user to the category
        user = self.context['request'].user
        if Category.objects.filter(user=user, name=validated_data['name']).exists():
            raise serializers.ValidationError({"name": "Category already exists."})
            
        validated_data['user'] = user
        return super().create(validated_data)

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    # Allow creating by name (fixes issue where frontend sends invalid default IDs)
    category_input = serializers.CharField(write_only=True, required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'category', 'category_name', 'category_input', 'description', 'date', 'payment_method', 'created_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        category_input = validated_data.pop('category_input', None)
        
        # If category name provided, get or create it
        if category_input:
            category_obj, created = Category.objects.get_or_create(user=user, name=category_input)
            validated_data['category'] = category_obj
            
        validated_data['user'] = user
        return super().create(validated_data)

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'amount', 'source', 'description', 'date', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'amount', 'month', 'year', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'name', 'type', 'balance', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'name', 'target_amount', 'saved_amount', 'target_date', 'status', 'description', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'avatar_url', 'monthly_budget', 'currency']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']
