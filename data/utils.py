import requests
import time
def get_request_with_retry(url, retries=3, delay=0.05):
    for attempt in range(retries):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response
        except (requests.exceptions.RequestException, requests.exceptions.ConnectionError) as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(delay)
    
    print(f"Failed to connect after {retries} attempts")
    return None  # Return None if all attempts fail
