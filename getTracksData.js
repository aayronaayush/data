const axios = require('axios')
const fs = require('fs')

const genres = require("./genre")

const token = require("./token")
const apiKey = `Bearer ${token}`

const headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"Authorization": apiKey
}

if (fs.existsSync(`${genres[0]}TracksData.csv`)) {
	fs.rmSync(`${genres[0]}Urls.csv`)
}

const meta = ['Genre', 'Name', "TrackId", "Popularity", "Year"]
const features = ["acousticness", "analysis_url", "danceability", "duration_ms", "energy", "instrumentalness", "key", "liveness", "loudness", "mode", "speechiness", "tempo", "time_signature", "track_href", "valence"]
const fileHeader = [...meta, ...features]

fs.writeFileSync("header", fileHeader.join("\t"))

console.log(fileHeader.join("\t"))

genres.forEach(async genre => {
// fs.writeFileSync(`${genre}TracksData.csv`, `${fileHeader.join(",")}\n`)
	const urls = fs.readFileSync(`${genres[0]}Urls.csv`, 'utf8')
	const urlsArray = urls.split('\n')

	let lines = ""
	let skip = 0
	if (fs.existsSync(`${genre}TracksData.tsv`)) {
		lines = fs.readFileSync(`${genre}TracksData.tsv`, 'utf8').split("\n")
		skip = lines.length - 2 | 0;
	}

	console.log(skip)

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
					fs.writeFileSync(`${genre}TracksData.tsv`, `${trackData.join("\t")}\n`, {flag: "a"})
				})
				.catch(err => {
					console.log(err)
				})
			}
		})
		.catch(err => {
			console.log(err)
		})
	}

})
