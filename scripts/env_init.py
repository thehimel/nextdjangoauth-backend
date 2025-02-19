import argparse

from django.core.management.utils import get_random_secret_key
from files import read_data, write_data

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create an environment file from an example.")
    parser.add_argument(
        "--env_example", dest="env_example", default=".env.example", help="Environment example file path."
    )
    parser.add_argument("--env", dest="env", default=".env", help="Environment file path.")

    args = parser.parse_args()
    env_example, env = args.env_example, args.env

    env_data = read_data(file_path=env_example)
    env_data["SECRET_KEY"] = get_random_secret_key()

    write_data(file_path=env, data=env_data)
