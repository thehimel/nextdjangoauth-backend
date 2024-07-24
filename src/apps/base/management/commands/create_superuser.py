from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a superuser and send an email verification link'

    def handle(self, *args, **options):
        username = input("Username: ")
        email = input("Email: ")
        password = input("Password: ")

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR(f'User "{username}" already exists.'))
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.ERROR(f'User with email {email} already exists.'))
            return

        # Create the superuser
        user = User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Superuser created with email {email}'))

        # Create an EmailAddress object for Allauth
        email_address = EmailAddress.objects.create(user=user, email=email, verified=False, primary=True)
        email_address.send_confirmation()
        self.stdout.write(self.style.SUCCESS(f'Verification email sent to {email}'))
