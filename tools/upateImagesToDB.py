import os
from pymongo import MongoClient
from bson.objectid import ObjectId

# MongoDB connection settings
mongo_uri = 'mongodb://localhost:27017/'
db_name = 'your_database_name'
collection_name = 'your_collection_name'

# Local folder where your images are stored
image_folder = '/path/to/your/image/folder'

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client[db_name]
collection = db[collection_name]

# Loop through image files in the local folder
for filename in os.listdir(image_folder):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        # Extract song title from filename (assuming filename is like "SongTitle.jpg")
        song_title = os.path.splitext(filename)[0]
        image_path = os.path.join(image_folder, filename)

        # Search for the song in the MongoDB collection
        song = collection.find_one({"title": song_title})
        
        if song:
            # Update the document with the image path
            collection.update_one(
                {"_id": song["_id"]},
                {"$set": {"ChordsImage": image_path}}
            )
            print(f"Updated song '{song_title}' with image '{filename}'")
        else:
            print(f"Song '{song_title}' not found in the database")

print("Image update process completed.")
