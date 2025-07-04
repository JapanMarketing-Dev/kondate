#!/usr/bin/env python3
"""
Chat API Client

This module provides functionality to send chat messages to the specified API endpoint.
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any, Optional


class ChatAPIClient:
    """Client for interacting with the chat API."""
    
    def __init__(self):
        self.base_url = "https://xrvp-5l6a-rpaf.t7.xano.io/api:z1PY1HTu/chat"
        self.headers = {
            "Content-Type": "application/json"
        }
    
    def send_message(self, text: str, channel: str, user: str, mention: str, date: str) -> Dict[str, Any]:
        """
        Send a message to the chat API.
        
        Args:
            text (str): The message text
            channel (str): The channel identifier
            user (str): The user identifier
            mention (str): The mention identifier
            date (str): The date string
            
        Returns:
            Dict[str, Any]: API response as a dictionary
            
        Raises:
            requests.exceptions.RequestException: If the API request fails
        """
        payload = {
            "text": text,
            "channel": channel,
            "user": user,
            "mention": mention,
            "date": date
        }
        
        try:
            response = requests.post(
                self.base_url,
                headers=self.headers,
                data=json.dumps(payload),
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API request failed: {e}")
            raise
    
    def send_test_message(self) -> Dict[str, Any]:
        """
        Send a test message with the original example data.
        
        Returns:
            Dict[str, Any]: API response as a dictionary
        """
        return self.send_message("1", "2", "3", "4", "5")


def main():
    """Main function to demonstrate API usage."""
    print("Chat API Client Test")
    print("=" * 50)
    
    client = ChatAPIClient()
    
    # Test 1: Original example data
    print("\n1. Testing with original example data:")
    try:
        result = client.send_test_message()
        print(f"✓ Success! Response: {json.dumps(result, indent=2)}")
    except Exception as e:
        print(f"✗ Failed: {e}")
    
    # Test 2: Custom message
    print("\n2. Testing with custom message:")
    try:
        current_time = datetime.now().isoformat()
        result = client.send_message(
            text="Hello from Python!",
            channel="general",
            user="python_user",
            mention="@everyone",
            date=current_time
        )
        print(f"✓ Success! Response: {json.dumps(result, indent=2)}")
    except Exception as e:
        print(f"✗ Failed: {e}")
    
    # Test 3: Edge case - empty strings
    print("\n3. Testing with empty strings:")
    try:
        result = client.send_message("", "", "", "", "")
        print(f"✓ Success! Response: {json.dumps(result, indent=2)}")
    except Exception as e:
        print(f"✗ Failed: {e}")
    
    print("\n" + "=" * 50)
    print("Test completed!")


if __name__ == "__main__":
    main()