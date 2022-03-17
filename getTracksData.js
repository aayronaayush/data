const axios = require('axios')
const fs = require('fs')

const genres = ["pop"]

const apiKey = 'Bearer <oauth token>'

const headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"Authorization": apiKey
}

const meta = ['Genre', 'Name', "TrackId", "Popularity", "Year"]
const features = ["acousticness", "analysis_url", "danceability", "duration_ms", "energy", "instrumentalness", "key", "liveness", "loudness", "mode", "speechiness", "tempo", "time_signature", "track_href", "valence"]
const fileHeader = [...meta, ...features]

genres.forEach(async genre => {
// fs.writeFileSync(`${genre}TracksData.csv`, `${fileHeader.join(",")}\n`)
	const urls = fs.readFileSync(`${genres[0]}Urls.csv`, 'utf8')
	const urlsArray = urls.split('\n')

	const lines = fs.readFileSync(`${genre}TracksData.csv`, 'utf8').split("\n")
	const skip = lines.length - 2;


	for (let i=skip; i < urlsArray.length; i++) {
		await new Promise(resolve => setTimeout(resolve, 5));
		console.log(`Requesting ${urlsArray[i]}`)
		await axios(urlsArray[i], {
			method: "GET",
			headers
		})
		.then(async response => {
			const songData = response.data
			let trackData = []
			trackData[0] = genre
			trackData[1] = songData.name
			trackData[2] = songData.id
			trackData[3] = songData.popularity
			const releaseYear = Number(songData.album.release_date.split("-")[0])
			trackData[4] = releaseYear
			if (releaseYear >= 2010) {
				await axios(`https://api.spotify.com/v1/audio-features/${songData.id}`, {
					method: "GET",
					headers
				})
				.then(response => {
					const songFeatures = response.data
					features.forEach(feature => {
						trackData.push(songFeatures[feature])
					})
					fs.writeFileSync(`${genre}TracksData.csv`, `${trackData.join(",")}\n`, {flag: "a"})
				})
				.catch(err => {
					console.log(err)
				})
			}

			// make a request for song features
		})
		.catch(err => {
			console.log(err)
		})
	}

})
