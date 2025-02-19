# NextDjangoAuth

## Getting Started

You can simply run [init.sh](init.sh) to set up everything, or follow the steps below.

### Initialize Client

* Steps are mentioned [here](src/client/README.md)

### Initialize Server

* Clone the repository.
* Create the `.env` file from `.env.example`.
* Upgrade pip: `python3 -m pip install --upgrade pip setuptools`
* Installing packages: `pip install -r requirements.txt`
* Migrating Database:
  * `python3 manage.py makemigrations`
  * `python3 manage.py migrate`

### Create Super User

* `python manage.py create_superuser`
