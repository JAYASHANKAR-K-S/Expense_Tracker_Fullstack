from django.contrib import admin
from .models import Category, Expense, Income, Budget, UserProfile, Goal, Wallet

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    search_fields = ('name', 'user__username')
    list_filter = ('user',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('amount', 'category', 'date', 'user')
    search_fields = ('description', 'user__username')
    list_filter = ('date', 'category', 'user')

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('amount', 'source', 'date', 'user')
    search_fields = ('source', 'user__username')
    list_filter = ('date', 'user')

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('amount', 'month', 'year', 'user')
    list_filter = ('year', 'month', 'user')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'monthly_budget', 'currency')
    search_fields = ('user__username', 'user__email', 'phone')

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('name', 'target_amount', 'saved_amount', 'status', 'target_date', 'user')
    list_filter = ('status', 'user')
    search_fields = ('name', 'user__username')

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'balance', 'user')
    list_filter = ('type', 'user')
    search_fields = ('name', 'user__username')
