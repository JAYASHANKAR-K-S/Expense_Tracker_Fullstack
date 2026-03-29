from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from expenses.models import Category

class Command(BaseCommand):
    help = 'Seeds default categories for all users'

    def handle(self, *args, **kwargs):
        DEFAULTS = [
            'Food & Dining', 
            'Travel & Transport', 
            'Rent & Utilities', 
            'Shopping', 
            'Bills & Fees', 
            'Entertainment', 
            'Health & Fitness', 
            'Investment',
            'Education',
            'Gifts & Donations'
        ]

        users = User.objects.all()
        if not users.exists():
            self.stdout.write(self.style.ERROR("No users found! Please register a user first."))
            return

        for user in users:
            self.stdout.write(f"Seeding for {user.username}...")
            count = 0
            for cat_name in DEFAULTS:
                obj, created = Category.objects.get_or_create(user=user, name=cat_name)
                if created:
                    count += 1
            self.stdout.write(self.style.SUCCESS(f"  -> Added {count} categories."))

        self.stdout.write(self.style.SUCCESS("✅ Seeding Complete!"))
