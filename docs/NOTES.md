# Configuration

## Commands

```
python manage.py startapp app_name


npm create vite@latest
npm install
npm run dev
npx vite build
```

## Django Cleanup

### Setup

* Install library: [django-cleanup](https://pypi.org/project/django-cleanup/)

#### Update `settings.py`

```
INSTALLED_APPS = (
    ...,
    
    # Must be on the bottom of INSTALLED_APPS.
    'django_cleanup.apps.CleanupConfig',
)
```

> Note: It does not delete files in local deployment. It deletes file in production i.e. cloudinary.

## Cloudinary

### Setup

* Install library: [django-cloudinary-storage](https://pypi.org/project/django-cloudinary-storage/)

#### Update `settings.py`

```
INSTALLED_APPS = [
    # ...
    'django.contrib.staticfiles',
    'cloudinary_storage',
    'cloudinary',
    # ...
]

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'your_cloud_name',
    'API_KEY': 'your_api_key',
    'API_SECRET': 'your_api_secret'
}

MEDIA_URL = '/media/'  # or any prefix you choose
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

### Configration

* Updated the cloudinary upload configuration as shown in the screenshot.

![cloudinary_upload_settings.png](images/cloudinary_upload_settings.png)

### Upload Default Profile Picture

* Login and upload the profile picture. You need to create the parent directory "media".
* The file will automatically get renamed. But you just need to change back the file name i.e. "profile-picture".
* The file extension is not visible, but it is same as the uploaded one. So, you do not need to add an extension.

## Generate ER Diagram

### Setup

* Install [django-extensions](https://django-extensions.readthedocs.io/)

```
pip install django-extensions pydotplus
brew install graphviz
```

```python
INSTALLED_APPS = [
    ...,
    'django_extensions',
]
```

### Run

* Run `python manage.py graph_models -a -g -o models.png`

## Registration of Admin User and Email Verification

* The users created via `createsuperuser` is not added to `allauth` users. Therefore, email verification is not
  possible. And resending verification email is not also possible for this type of user.
* The trick is to create a user via `createsuperuser`.
* Then create a normal user via REST API. Email can be same as the admin user because the admin user not yet present in
  `allauth` users' database.
* Now verify this normal user.
* Login with the admin user in the admin panel and make the normal user an admin.
* Login with the new admin user and delete the previous admin user.

### Mitigation

* A signal in the `base` app is added to update the domain name automatically after migrations takes place.
* A management command is added to create a superuser in the `allauth` database.
  * Execute with `python manage.py create_superuser`.
* However, it does not automatically send the confirmation email because even if it sends the link expires.
* Therefore, email verification is skipped.

## Configure Google Login with Implicit Grant

### Configure Google App

* Go to https://console.cloud.google.com/
* Create a project.

#### OAuth consent screen

* Register an app (only the below-mentioned fields are to be filled):
  * User Type: `External`
  * App information
    * App name: `ENTER_ANY_DATA`
    * User support email: `ENTER_ANY_DATA`
    * All fields of `App domain` are option, keep them blank.
    * Developer contact information: `ENTER_ANY_DATA`
  * Scopes
    * `./auth/userinfo.email`
    * `./auth/userinfo.profile`
  * Test users
    * User information: `ENTER_DATA_TO_BE_USED_AS_TEST_USER`

#### Credentials

* Click on `+ CREATE CREDENTIALS` and select `OAuth client ID`
* Application type: `Web application`
* Name: `ENTER_ANY_DATA`
* Authorized JavaScript origins:
  * http://127.0.0.1:8000
  * https://brandname.vercel.app
* Authorized redirect URIs
  * http://127.0.0.1:8000/
  * https://brandname.vercel.app/

> `Authorized JavaScript origins` is just the domain name. No slash at the end.
> `Authorized redirect URI` is the URI where the redirection should take place after authentication. Must end with '/'.
> You will get Client ID and Client Secret after creation of the credentials.

### Configure Backend

[Guide](https://dj-rest-auth.readthedocs.io/en/latest/installation.html#google)

```python
# src/core/settings.py

INSTALLED_APPS = (
    ...,
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    ...,
)

# src/apps/base/views/google_login.py
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView): # if you want to use Implicit Grant, use this
    adapter_class = GoogleOAuth2Adapter

# src/apps/base/urls.py
from django.urls import path

urlpatterns = [
    ...,
    path('api/auth/google/', GoogleLogin.as_view(), name='google_auth'),
]
```

> if you encounter any error regarding cryptography: `pip install cryptography`

### Create Social App in Django Admin

* Go to Django Admin panel and select `Social applications` and create one:
  * Provider: `Google`
  * Name: `ENTER_ANY_DATA`
  * Client id: `CLIENT_ID_FROM_GOOGLE`
  * Secret key: `CLIENT_SECRET_FROM_GOOGLE`
  * Sites: Move desired sites from `Available sites` to `Chosen sites`.

> To automate this step, you can add a `post_migrate` signal to create a `social app` with provider = `google` not
  exists. All available sites must be added to this social app.

### Test

### Get the access_token

Create a GET request to the following URL:

* Pattern: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=<CALLBACK_URL_ON_GOOGLE>&prompt=consent&response_type=token&client_id=<YOUR CLIENT ID>&scope=openid%20email%20profile`
* Example: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://127.0.0.1:8000/&prompt=consent&response_type=token&client_id=1234-abcd1234.apps.googleusercontent.com&scope=openid%20email%20profile`

### Verify

* Go to http://127.0.0.1:8000/swagger/
* Select `POST: /api/auth/google/`

#### Example Request

```json
{
  "access_token": "ENTER_ACCESS_TOKEN"
}
```

#### Example Response

```json
{
  "access": "ACCESS_TOKEN_SPECIFIC_TO_THE_SERVER",
  "refresh": "",
  "user": {
    "pk": 12,
    "username": "bob",
    "email": "bob@gmail.com",
    "first_name": "Bob",
    "last_name": "Adam"
  }
}
```

> You will save this `access` in the client just like email authentication.
