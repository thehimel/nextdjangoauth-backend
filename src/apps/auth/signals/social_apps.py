from django.contrib.sites.models import Site
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from allauth.socialaccount.models import SocialApp

from apps.auth.utils.utils import logger
from core.constants import BRAND_NAME, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET


# Module-level flag to track if the signal has already executed
social_app_updated = False


@receiver(post_migrate)
def create_social_app(sender, **kwargs):
    global social_app_updated
    if social_app_updated:
        return

    # Define social app parameters
    provider = 'google'
    name = BRAND_NAME
    client_id = GOOGLE_CLIENT_ID
    secret_key = GOOGLE_CLIENT_SECRET

    # Update or create the social app
    social_app, created = SocialApp.objects.update_or_create(
        provider=provider,
        defaults={'name': name, 'client_id': client_id, 'secret': secret_key}
    )

    if created:
        logger.info(f"Created new social app: {name}")
    else:
        logger.info(f"Updated existing social app: {name}")

    # Add all available sites to this social app
    available_sites = Site.objects.all()
    social_app.sites.set(available_sites)
    social_app.save()

    logger.info(f"Social app {name} is linked to sites: {[site.domain for site in available_sites]}")

    # Set the flag to prevent the signal from running again in the same session
    social_app_updated = True
