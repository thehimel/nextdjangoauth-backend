"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 5.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from datetime import timedelta
from pathlib import Path

import dj_database_url
from decouple import config
from django.core.management.utils import get_random_secret_key

from apps.auth.utils.cloudinary import parse_cloudinary_url
from core.constants import BRAND_NAME, DEVELOPMENT, PRODUCTION

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

ENVIRONMENT = config("ENVIRONMENT", default=DEVELOPMENT)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY", default=get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if ENVIRONMENT == DEVELOPMENT else config("DEBUG", cast=bool, default=False)

NEXT_FRONTEND_URL = config("NEXT_FRONTEND_URL", default="http://localhost:3000")
DJANGO_BACKEND_HOST = config("DJANGO_BACKEND_HOST", default="localhost")

ALLOWED_HOSTS = [DJANGO_BACKEND_HOST]

CORS_ALLOW_ALL_ORIGINS = False

if ENVIRONMENT == DEVELOPMENT:
    CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
    CSRF_TRUSTED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
else:
    CORS_ALLOWED_ORIGINS = [NEXT_FRONTEND_URL]
    CSRF_TRUSTED_ORIGINS = [NEXT_FRONTEND_URL]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    "OPTIONS",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

SECURE_BROWSER_XSS_FILTER = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = False if ENVIRONMENT == DEVELOPMENT else True
SESSION_COOKIE_SECURE = False if ENVIRONMENT == DEVELOPMENT else True
CSRF_COOKIE_SECURE = False if ENVIRONMENT == DEVELOPMENT else True

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # ---
    'django.contrib.sites',  # Required by django-allauth
    # ---
    'apps.auth.apps.AuthConfig',
    'apps.users',
    # --- REST APIs and authentication
    'drf_yasg',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    # --- Utilities
    'django_extensions',  # Generate graph model.
    # --- Storage
    'cloudinary_storage',
    'cloudinary',
    'django_cleanup.apps.CleanupConfig',  # Must be on the bottom of INSTALLED_APPS.
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top.
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # To serve static files in PaaS. To be removed if S3 is being used.
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware",  # The allauth account middleware.
]

ROOT_URLCONF = 'core.urls'

TEMPLATE_DIR = BASE_DIR / 'templates'
CLIENT_TEMPLATE_DIR = BASE_DIR / 'client/dist'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATE_DIR, CLIENT_TEMPLATE_DIR],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',  # `allauth` needs this from django.
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
database_url = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"

if ENVIRONMENT == PRODUCTION:
    database_url = config('DATABASE_URL')

DATABASES = {'default': dj_database_url.parse(database_url, conn_max_age=600)}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Berlin'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = 'static/'

STATIC_DIR = BASE_DIR / 'static'
CLIENT_STATIC_DIR = BASE_DIR / 'client/dist/static'

# Keep your static files here.
# collectstatic will use this directory to generate static files in STATIC_ROOT.
STATICFILES_DIRS = [STATIC_DIR, CLIENT_STATIC_DIR]

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media files (Uploaded by the users)
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = 'media/'

# The allauth configurations.
SITE_ID = 1
AUTHENTICATION_BACKENDS = [
    # Needed to log in by username in Django admin, regardless of `allauth`.
    'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods, such as login by email.
    'allauth.account.auth_backends.AuthenticationBackend',
]

ACCOUNT_ADAPTER = 'apps.auth.adapters.AccountAdapter'  # Custom URLs

# Use username or email as the primary identifier
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_CONFIRM_EMAIL_ON_GET = True  # Verify email by clicking on the confirmation URL.
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 1
ACCOUNT_USERNAME_REQUIRED = False  # Make username optional for registration.
ACCOUNT_PRESERVE_USERNAME_CASING = False  # Always use lowercase for username.
ACCOUNT_LOGOUT_REDIRECT_URL = '/'
ACCOUNT_LOGOUT_ON_GET = True  # No confirmation page for logout.
ACCOUNT_RATE_LIMITS = {
    'login_failed': '5/minute',  # Up to 5 failed login attempts per minute.
    'registration_failed': '10/hour',  # Up to 10 failed registration attempts per hour.
}

FRONTEND_URL = config('FRONTEND_URL', default='http://127.0.0.1:8000')


# LOGIN_REDIRECT_URL = "base:home"
# LOGIN_URL = '/'

EMAIL_USE_TLS = True  # This must be True.
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = config('EMAIL_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_PASSWORD', default='')
DEFAULT_FROM_EMAIL = f'{BRAND_NAME} <info@domain.com>'  # Default sender is mandatory.

AUTH_USER_MODEL = "users.User"  # Using custom user model.

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "SIGNING_KEY": SECRET_KEY,
}

# dj-rest-auth JWT settings
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'JWT_AUTH_COOKIE',
    'JWT_AUTH_REFRESH_COOKIE': 'JWT_AUTH_REFRESH_COOKIE',
}

if ENVIRONMENT == PRODUCTION:
    CLOUDINARY_URL = config('CLOUDINARY_URL')
    CLOUDINARY_STORAGE = parse_cloudinary_url(cloudinary_url=CLOUDINARY_URL)

    # For images
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
