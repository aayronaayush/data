# data
All the data was collected using the Spotify API. To begin data collection, we identified two categories of songs that we were interested in analysing. Then to get a list to songs, multiple API calls were made to the spotify API to get the list of songs track urls and these were saved to a saved to a file. After which for each of the track urls in the file an API call was made to the Spotify API to get basic information about the song, after which another call was made to the API to get data about songs features and after both these API calls the data was written to a CSV which can be easily imported into a spreadsheet software for analysis.
