import json

# Define the correct book names and their two-letter abbreviations for the 66 books of the Bible
book_data_by_number = {
    1: {"name": "Genesis", "abbreviation": "Ge"},
    2: {"name": "Exodus", "abbreviation": "Ex"},
    3: {"name": "Leviticus", "abbreviation": "Le"},
    4: {"name": "Numbers", "abbreviation": "Nu"},
    5: {"name": "Deuteronomy", "abbreviation": "De"},
    6: {"name": "Joshua", "abbreviation": "Jo"},
    7: {"name": "Judges", "abbreviation": "Ju"},
    8: {"name": "Ruth", "abbreviation": "Ru"},
    9: {"name": "1 Samuel", "abbreviation": "1S"},
    10: {"name": "2 Samuel", "abbreviation": "2S"},
    11: {"name": "1 Kings", "abbreviation": "1K"},
    12: {"name": "2 Kings", "abbreviation": "2K"},
    13: {"name": "1 Chronicles", "abbreviation": "1C"},
    14: {"name": "2 Chronicles", "abbreviation": "2C"},
    15: {"name": "Ezra", "abbreviation": "Ez"},
    16: {"name": "Nehemiah", "abbreviation": "Ne"},
    17: {"name": "Esther", "abbreviation": "Es"},
    18: {"name": "Job", "abbreviation": "Jo"},
    19: {"name": "Psalms", "abbreviation": "Ps"},
    20: {"name": "Proverbs", "abbreviation": "Pr"},
    21: {"name": "Ecclesiastes", "abbreviation": "Ec"},
    22: {"name": "Song of Solomon", "abbreviation": "So"},
    23: {"name": "Isaiah", "abbreviation": "Is"},
    24: {"name": "Jeremiah", "abbreviation": "Je"},
    25: {"name": "Lamentations", "abbreviation": "La"},
    26: {"name": "Ezekiel", "abbreviation": "Eze"},
    27: {"name": "Daniel", "abbreviation": "Da"},
    28: {"name": "Hosea", "abbreviation": "Ho"},
    29: {"name": "Joel", "abbreviation": "Jo"},
    30: {"name": "Amos", "abbreviation": "Am"},
    31: {"name": "Obadiah", "abbreviation": "Ob"},
    32: {"name": "Jonah", "abbreviation": "Jo"},
    33: {"name": "Micah", "abbreviation": "Mi"},
    34: {"name": "Nahum", "abbreviation": "Na"},
    35: {"name": "Habakkuk", "abbreviation": "Ha"},
    36: {"name": "Zephaniah", "abbreviation": "Ze"},
    37: {"name": "Haggai", "abbreviation": "Ha"},
    38: {"name": "Zechariah", "abbreviation": "Ze"},
    39: {"name": "Malachi", "abbreviation": "Ma"},
    40: {"name": "Matthew", "abbreviation": "Mt"},
    41: {"name": "Mark", "abbreviation": "Mk"},
    42: {"name": "Luke", "abbreviation": "Lu"},
    43: {"name": "John", "abbreviation": "Jo"},
    44: {"name": "Acts", "abbreviation": "Ac"},
    45: {"name": "Romans", "abbreviation": "Ro"},
    46: {"name": "1 Corinthians", "abbreviation": "1C"},
    47: {"name": "2 Corinthians", "abbreviation": "2C"},
    48: {"name": "Galatians", "abbreviation": "Ga"},
    49: {"name": "Ephesians", "abbreviation": "Ep"},
    50: {"name": "Philippians", "abbreviation": "Ph"},
    51: {"name": "Colossians", "abbreviation": "Co"},
    52: {"name": "1 Thessalonians", "abbreviation": "1T"},
    53: {"name": "2 Thessalonians", "abbreviation": "2T"},
    54: {"name": "1 Timothy", "abbreviation": "1T"},
    55: {"name": "2 Timothy", "abbreviation": "2T"},
    56: {"name": "Titus", "abbreviation": "Ti"},
    57: {"name": "Philemon", "abbreviation": "Ph"},
    58: {"name": "Hebrews", "abbreviation": "He"},
    59: {"name": "James", "abbreviation": "Ja"},
    60: {"name": "1 Peter", "abbreviation": "1P"},
    61: {"name": "2 Peter", "abbreviation": "2P"},
    62: {"name": "1 John", "abbreviation": "1J"},
    63: {"name": "2 John", "abbreviation": "2J"},
    64: {"name": "3 John", "abbreviation": "3J"},
    65: {"name": "Jude", "abbreviation": "Ju"},
    66: {"name": "Revelation", "abbreviation": "Re"}
}

def update_json_file(input_file_path, output_file_path):
    # Read the input JSON file
    with open(input_file_path, 'r', encoding='utf-8') as infile:
        data = json.load(infile)
    
    # Update the `book_name` and add `abbreviation` to each verse
    for verse in data.get('verses', []):
        book_number = verse.get('book')
        if book_number in book_data_by_number:
            book_info = book_data_by_number[book_number]
            verse['book_name'] = book_info['name']
            verse['abbreviation'] = book_info['abbreviation']
    
    # Write the updated JSON data to the output file
    with open(output_file_path, 'w', encoding='utf-8') as outfile:
        json.dump(data, outfile, ensure_ascii=False, indent=4)

# Example usage
input_file_path = 'web.json'
output_file_path = 'web_Heb.json'
update_json_file(input_file_path, output_file_path)
