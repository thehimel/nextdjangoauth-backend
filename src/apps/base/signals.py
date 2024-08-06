from django.conf import settings
from django.contrib.sites.models import Site
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from allauth.socialaccount.models import SocialApp

from apps.base.utils.utils import logger
from core.constants import BRAND_NAME, DOMAIN_NAME, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

# Module-level flag to track if the signal has already executed
site_updated = False


@receiver(post_migrate)
def set_default_site(sender, **kwargs):
    global site_updated
    if site_updated:
        return

    site_id = getattr(settings, 'SITE_ID', 1)  # Get SITE_ID from settings, default to 1 if not set
    domain = DOMAIN_NAME
    name = BRAND_NAME  # Optionally set a static name or use request data

    if Site.objects.filter(id=site_id).exists():
        site = Site.objects.get(id=site_id)
        logger.info(f"Updating site domain from {site.domain} to {domain}")
        if site.domain != domain:
            site.domain = domain
            site.name = name
            site.save()
            logger.info(f"Site updated: {site.domain}, {site.name}")
        else:
            logger.info(f"Site domain is already set to {domain}, no changes made.")
    else:
        Site.objects.create(id=site_id, domain=domain, name=name)
        logger.info(f"Created new site: {domain}, {name}")

    # Set the flag to prevent the signal from running again in the same session
    site_updated = True


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

    # Check if the social app already exists
    social_app, created = SocialApp.objects.get_or_create(
        provider=provider,
        defaults={'name': name, 'client_id': client_id, 'secret': secret_key}
    )

    if created:
        logger.info(f"Created new social app: {name}")
    else:
        logger.info(f"Social app {name} already exists")

    # Add all available sites to this social app
    available_sites = Site.objects.all()
    social_app.sites.set(available_sites)
    social_app.save()

    logger.info(f"Social app {name} is linked to sites: {[site.domain for site in available_sites]}")

    # Set the flag to prevent the signal from running again in the same session
    social_app_updated = True
