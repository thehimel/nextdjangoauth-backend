from decouple import config

DEVELOPMENT = 'DEV'
PRODUCTION = 'PROD'
BRAND_NAME = config('BRAND_NAME', default='Brand Name')
