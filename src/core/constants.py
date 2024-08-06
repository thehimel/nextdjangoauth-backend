from decouple import config

DEVELOPMENT = 'DEV'
PRODUCTION = 'PROD'
BRAND_NAME = config('BRAND_NAME', default='server')
DOMAIN_NAME = config('DOMAIN_NAME', default='127.0.0.1:8000')
GOOGLE_CLIENT_ID = config('VITE_GOOGLE_CLIENT_ID', default='')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET', default='')
