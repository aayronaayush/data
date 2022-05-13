const axios = require("axios");
const fs = require("fs")

const genres = require("./genre")

const token = require("./token")

const apiKey = `Bearer ${token}`

const headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"Authorization": apiKey
}


const trackUrls = {}

const trackHref = []

if (fs.existsSync(`${genres[0]}Urls.csv`)) {
	fs.rmSync(`${genres[0]}Urls.csv`)
}

function getUrl(genre, limit=50, offset=0) {
	return `https://api.spotify.com/v1/search?q=${genre}&type=track&limit=${limit}&offset=${(offset + 1)*limit}`
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
		const totalOffsets = Math.floor(total/limit)

		trackUrls[genre] = []
		
		for (let i=0; i < totalOffsets; i++) {
			console.log({totalOffsets, total})
			const url = getUrl(genre, limit, i)
			console.log(url)
			await axios(url, {
				method: "GET",
				headers
			})
			.then(response => {
				const tracks = response.data.tracks
				tracks.items.forEach(item => {
					// console.log(item.href)
					if (!trackHref.includes(item.href)) {
						trackHref.push(item.href)
						fs.writeFileSync(`${genre}Urls.csv`, `${item.href}\n`, {flag: "a"}, (err) => {
							if (err) {
								console.error(err)
							}
						})
						trackUrls[genre] = [...trackUrls[genre], item.href]
					}
				})
			})
			.catch(err => {
				// console.log(url)
				console.log(err)
				console.log(`Error requesting: ${url}`)
				console.log(err.response)
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
