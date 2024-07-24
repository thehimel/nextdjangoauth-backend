from decouple import config

DEVELOPMENT = 'DEV'
PRODUCTION = 'PROD'
BRAND_NAME = config('BRAND_NAME', default='Brand Name')
DOMAIN_NAME = config('DOMAIN_NAME', default='127.0.0.1:8000')
