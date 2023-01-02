const { EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

async function readAndParseJSON(filePath) {
	const data = await fs.promises.readFile(filePath, 'utf8');
	if (data.length === 0) {
		return ({
			"history": [],
			"searches": []
		})
	}
	return JSON.parse(data);
}

async function writeJSON(filePath, data) {
	const json = JSON.stringify(data, null, 2);
	await fs.promises.writeFile(filePath, json, 'utf8');
}

const wrapper = (article => {
	return (
		new EmbedBuilder()
			.setColor(0xFFFFFF)
			.setTitle(article.title)
			.setURL(article.url)
			.setDescription(`Price: ${article.price}`)
			.setThumbnail('https://play-lh.googleusercontent.com/K0KbcPISM9BIJ7zvyZYSy-L75-xC9UiXxGzpb6mBM1bNnXiWKhqWFxrsBTsun-j7cIg')
			.setImage(article.pic)
	)
})

module.exports = { readAndParseJSON, writeJSON, wrapper };
