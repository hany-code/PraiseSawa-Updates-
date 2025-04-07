# import json

# def arabic_to_franco(text):
#     # Dictionary to map Arabic characters to Franco
#     franco_map = {
#         'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': '7', 'خ': 'kh',
#         'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': '9',
#         'ض': '9', 'ط': '6', 'ظ': '6', 'ع': '3', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
#         'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
#         'أ': 'a', 'إ': 'e', 'آ': 'a', 'ؤ': 'w', 'ئ': 'y', 'ى': 'a', 'ة': 'h'
#     }
    
#     franco_text = ""
#     for char in text:
#         franco_text += franco_map.get(char, char)
    
#     return franco_text

# def translate_file(input_file_path, output_file_path):
#     # Load the JSON data from the provided file
#     with open(input_file_path, 'r', encoding='utf-8') as file:
#         data = json.load(file)
    
#     # Write loaded data to a debug file
#     with open('debug_loaded_data.txt', 'w', encoding='utf-8') as debug_file:
#         debug_file.write(str(data))
    
#     # Check if data is a dictionary or list
#     if isinstance(data, dict):
#         items = [data]  # Convert dict to list of one item
#     elif isinstance(data, list):
#         items = data
#     else:
#         raise ValueError("Unsupported JSON format")
    
#     # Translate the text using the franco dictionary
#     translated_data = []
#     for item in items:
#         if not isinstance(item, dict):
#             raise ValueError("Each item in the JSON list should be a dictionary")
        
#         # Ensure all expected keys exist in the item dictionary
#         if "title" in item and "verses" in item:
#             translated_item = {
#                 "title": arabic_to_franco(item["title"]),
#                 "formated": item.get("formated", ""),
#                 "chorusFirst": item.get("chorusFirst", False),
#                 "chorus": [arabic_to_franco(line) for line in item.get("chorus", [])],
#                 "verses": [[arabic_to_franco(line) for line in verse] for verse in item.get("verses", [])]
#             }
#             translated_data.append(translated_item)
#         else:
#             with open('debug_missing_keys.txt', 'a', encoding='utf-8') as debug_file:
#                 debug_file.write(f"Skipping item due to missing keys: {item}\n")
    
#     # Save the combined translated data to a new JSON file
#     with open(output_file_path, 'w', encoding='utf-8') as file:
#         json.dump(translated_data, file, ensure_ascii=False, indent=4)

# # File paths (replace with your actual file paths)
# input_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\tasbe7naDBARb.json'
# output_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\translated_tesp7naENG.json'

# # Translate the file
# translate_file(input_file_path, output_file_path)
import json
import os
import re

# Updated Franco Arab dictionary mapping without numbers
FRANCO_MAP = {
    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
    'أ': 'a', 'إ': 'e', 'آ': 'a', 'ؤ': 'w', 'ئ': 'y', 'ى': 'a', 'ة': 'h'
}

# Arabic diacritics (tashkeel)
DIACRITICS_PATTERN = re.compile(r'[\u0617-\u061A\u064B-\u0652]')

def remove_diacritics(text):
    """
    Removes Arabic diacritics (tashkeel) from the text.
    
    Args:
        text (str): Arabic text with possible diacritics.
    
    Returns:
        str: Text without diacritics.
    """
    return re.sub(DIACRITICS_PATTERN, '', text)

def arabic_to_franco(text):
    """
    Converts an Arabic string to Franco Arab using a predefined mapping.
    
    Args:
        text (str): Arabic text to be converted.
    
    Returns:
        str: Franco Arab transliteration of the input text.
    """
    # Remove diacritics before converting
    text = remove_diacritics(text)
    return ''.join(FRANCO_MAP.get(char, char) for char in text)

def log_error(message, file_path='error_log.txt'):
    """
    Logs errors to a specified file.
    
    Args:
        message (str): Error message to be logged.
        file_path (str): Path to the log file.
    """
    with open(file_path, 'a', encoding='utf-8') as file:
        file.write(message + '\n')

def translate_file(input_file_path, output_file_path):
    """
    Translates a JSON file containing Arabic song lyrics into Franco Arab format.
    
    Args:
        input_file_path (str): Path to the input JSON file.
        output_file_path (str): Path to save the translated JSON file.
    
    Raises:
        FileNotFoundError: If the input file is not found.
        ValueError: If the input JSON format is invalid.
    """
    if not os.path.exists(input_file_path):
        raise FileNotFoundError(f"Input file does not exist: {input_file_path}")
    
    try:
        # Load JSON data
        with open(input_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Process the data: Ensure it's either a dictionary or a list of dictionaries
        if isinstance(data, dict):
            items = [data]
        elif isinstance(data, list):
            items = data
        else:
            raise ValueError("Unsupported JSON format. Expecting a list or dictionary.")
        
        translated_data = []
        
        # Loop through items and translate
        for item in items:
            if not isinstance(item, dict):
                log_error(f"Skipping non-dictionary item: {item}")
                continue

            # Check required fields
            if "title" in item and "verses" in item:
                translated_item = {
                    "title": arabic_to_franco(item["title"]),
                    "formated": item.get("formated", ""),
                    "chorusFirst": item.get("chorusFirst", False),
                    "chorus": [arabic_to_franco(line) for line in item.get("chorus", [])],
                    "verses": [[arabic_to_franco(line) for line in verse] for verse in item.get("verses", [])]
                }
                translated_data.append(translated_item)
            else:
                log_error(f"Skipping item due to missing keys: {item}")
        
        # Save translated data to output file
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            json.dump(translated_data, output_file, ensure_ascii=False, indent=4)
ص
        print(f"Translation complete. Output saved to {output_file_path}")
    
    except json.JSONDecodeError:
        log_error(f"Error decoding JSON from file: {input_file_path}")
        raise ValueError("Invalid JSON format.")
    except Exception as e:
        log_error(str(e))
        raise e

# File paths (replace with actual file paths)
input_file_path = r"C:\work\praisSawa\tools\DB(with-id)\tasbe7naDBRbWithSongID.json"
output_file_path = r"C:\work\praisSawa\tools\DB(with-id)\tasbe7naDBFrancoWithSongIdUpadted.json"

# Translate the file
translate_file(input_file_path, output_file_path)
