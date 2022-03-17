const axios = require("axios");
const fs = require("fs")

const apiKey = 'Bearer <oauth token>'

const headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"Authorization": apiKey
}

const genres = ["party"]

const trackUrls = {}

function getUrl(genre, limit=50, offset=0) {
	return `https://api.spotify.com/v1/search?q=genre%3A${genre}&type=track&limit=${limit}&offset=${offset}`
}

async function getIds(genre) {
	const url = getUrl(genre);
	await axios(url, {
		method: "GET",
		headers
	})
	.then(async (response) => {
		console.log(response)
		const data = response.data
		total = data.tracks.total
		const limit = 50;
		const totalOffsets = total/limit

		trackUrls[genre] = []

		for (let i=0; i < totalOffsets; i++) {
			const url = getUrl(genre, limit, i)
			await axios(url, {
				method: "GET",
				headers
			})
			.then(response => {
				const tracks = response.data.tracks
				tracks.items.forEach(item => {
					console.log(item.href)
					fs.writeFileSync(`${genre}Urls.csv`, `${item.href}\n`, {flag: "a"}, (err) => {
						if (err) {
							console.error(err)
						}
					})
					trackUrls[genre] = [...trackUrls[genre], item.href]
				})
			})
			.catch(err => {
				console.log(`Error requesting: ${url}`)
				// console.log(url)
				console.log(err)
			})
		}
	})
	.catch(err => {
		console.log(genre)
		console.log(err)
	})
}

function main() {
	getIds(genres[0])
}

main()
