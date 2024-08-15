from django.conf import settings
from django.contrib.sites.models import Site
from django.db.models.signals import post_migrate
from django.dispatch import receiver

from apps.auth.constants import DOMAIN_NAME
from apps.auth.utils.utils import logger
from core.constants import BRAND_NAME

# Module-level flag to track if the signal has already executed
site_updated = False


@receiver(post_migrate)
def set_default_site(sender, **kwargs):
    global site_updated
    if site_updated:
        return

    site_id = getattr(settings, 'SITE_ID', 1)  # Get SITE_ID from settings, default to 1 if not set
    domain = DOMAIN_NAME
    name = BRAND_NAME.lower()

    if Site.objects.filter(id=site_id).exists():
        site = Site.objects.get(id=site_id)
        logger.info(f"Updating site domain from {site.domain} to {domain}")
        if site.domain != domain or site.name != name:
            site.domain = domain
            site.name = name
            site.save()
            logger.info(f"Site updated: {site.domain}, {site.name}")
        else:
            logger.info(f"Site domain is already set: {site.domain}, {site.name}. No changes made.")
    else:
        Site.objects.create(id=site_id, domain=domain, name=name)
        logger.info(f"Created new site: {domain}, {name}")

    # Set the flag to prevent the signal from running again in the same session
    site_updated = True
