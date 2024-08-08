from decouple import config

DOMAIN_NAME = config('DOMAIN_NAME', default='127.0.0.1:8000')
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET', default='')
