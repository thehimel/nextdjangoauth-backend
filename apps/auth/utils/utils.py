import logging
import re
from datetime import datetime, timedelta


def remove_special_characters(text: str):
    # Using a regular expression to keep only alphanumeric characters.
    return re.sub(r"[^a-zA-Z0-9]", "", text)


def get_timestamp_from_time_delta(days: int = 30):
    days = int(days)
    expiration_time = datetime.now() + timedelta(days=days)
    return int(expiration_time.timestamp())


logger = logging.getLogger()  # Use the root logger
