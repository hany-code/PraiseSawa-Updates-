const fs = require("fs");
const readline = require("readline");

// Function to search for a word in the song's properties
function searchInSong(song, query) {
  const lowerQuery = query.toLowerCase();

  // Check if the query is in the title
  if (song.title.toLowerCase().includes(lowerQuery)) {
    return true;
  }

  // Check if the query is in the chorus
  if (song.chorus && song.chorus.some(line => line.toLowerCase().includes(lowerQuery))) {
    return true;
  }

  // Check if the query is in any verse
  if (song.verses && song.verses.some(verse => verse.some(line => line.toLowerCase().includes(lowerQuery)))) {
    return true;
  }

  return false;
}

// Function to print the song details
function printSongDetails(song) {
  // Print the title
  console.log(`Title: ${song.title}\n`);

  // Print the song ID
  console.log(`Song ID: ${song.songID}\n`);

  // Print the formatted status if it exists
  if (song.formated !== undefined) {
    console.log(`Formatted: ${song.formated}\n`);
  }

  // Print the chorus if it exists
  if (song.chorus) {
    console.log("Chorus:");
    song.chorus.forEach((line) => {
      console.log(line);
    });
    console.log("\n");
  }

  // Print the verses
  console.log("Verses:");
  song.verses.forEach((verse, index) => {
    console.log(`Verse ${index + 1}:`);
    verse.forEach((line) => {
      console.log(line);
    });
    console.log();
  });
}

// Function to print the song titles with indexes and song IDs
function printSongsTitle(songs) {
  songs.forEach((song, index) => {
    console.log(`${index + 1}: Title: ${song.title}, Song ID: ${song.songID}`);
  });
}

// Create an interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read the JSON file containing the songs
fs.readFile("DB(with-id)/tasbe7naDBRbWithSongID.json", "utf8", (err, data) => {
  if (err) {
    console.error("Could not open the file!", err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Specify the search query
    const query = "من هو هذا"; // Replace with your actual search query

    // Filter the songs based on the search query
    const searchResults = jsonData.filter(song => searchInSong(song, query));

    // Print the search results
    if (searchResults.length > 0) {
      printSongsTitle(searchResults);

      // Prompt the user to select a song by its index
      rl.question('Enter the index of the song you want to see details for: ', (index) => {
        const songIndex = parseInt(index) - 1;

        if (songIndex >= 0 && songIndex < searchResults.length) {
          console.log(`\nDetails of song ${index}:\n`);
          const selectedSong = searchResults[songIndex];
          printSongDetails(selectedSong);

          // Read the second JSON file to find the corresponding song by songID
          fs.readFile("DB(with-id)/tasbe7naDBFrancoWithSongID.json", "utf8", (err, dataFranco) => {
            if (err) {
              console.error("Could not open the second file!", err);
              rl.close();
              return;
            }

            try {
              const jsonDataFranco = JSON.parse(dataFranco);
              const correspondingSong = jsonDataFranco.find(song => song.songID === selectedSong.songID);

              if (correspondingSong) {
                console.log("\nCorresponding song from tasbe7naDBFrancoWithSongID.json:\n");
                printSongDetails(correspondingSong);
              } else {
                console.log("No corresponding song found in tasbe7naDBFrancoWithSongID.json.");
              }
            } catch (e) {
              console.error("Error parsing the second JSON data:", e);
            }

            rl.close();
          });
        } else {
          console.log("Invalid index.");
          rl.close();
        }
      });
    } else {
      console.log("No results found.");
      rl.close();
    }
  } catch (e) {
    console.error("Error parsing JSON data:", e);
    rl.close();
  }
});
