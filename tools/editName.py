import os

def rename_photos(directory_path):
    # List all files in the directory
    for filename in os.listdir(directory_path):
        # Full path to the file
        file_path = os.path.join(directory_path, filename)
        
        # Check if it's a file (not a directory)
        if os.path.isfile(file_path):
            # Split the filename and its extension
            base, ext = os.path.splitext(filename)
            
            # Split base into parts by '.'
            parts = base.split('.')
            
            if len(parts) > 1:
                # Take the first part as base and the last part as the extension
                new_base = '.'.join(parts[:-1])
                new_ext = '.' + parts[-1]
                
                # Create the new filename with the last extension
                new_filename = f"{new_base}{new_ext}"
            else:
                # No extra extensions to handle
                new_filename = filename
            
            new_file_path = os.path.join(directory_path, new_filename)
            
            # Only rename if the new filename is different
            if file_path != new_file_path:
                os.rename(file_path, new_file_path)
                print(f"Renamed '{filename}' to '{new_filename}'")

# Example usage
directory_path = './downloaded_images'
rename_photos(directory_path)
