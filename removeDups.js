const fs = require("fs")

const urls = fs.readFileSync("chillUrls.csv", "utf-8").split("\n")

let uniqueUrls = []

urls.forEach(url => {
	if (!uniqueUrls.includes(url)) {
		uniqueUrls.push(url)
	}
})

fs.writeFileSync("chillUniqueUrls.csv", uniqueUrls.join("\n"))

console.log(urls.length)
console.log(uniqueUrls.length)