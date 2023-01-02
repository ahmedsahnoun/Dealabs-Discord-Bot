const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');
const { openDealabs } = require('./Scraper.js');
const { readAndParseJSON, writeJSON, wrapper } = require('./services.js')

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds
	]
})

client.login(token);

const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const BaseURL = "https://www.dealabs.com/groupe"

async function running() {
	const params = await readAndParseJSON("./SearchParameters.json")

	for (search of params.searches) {
		const result = await openDealabs(BaseURL, search.category)

		for (article of result) {
			if (!params.history.includes(article.url)) {
				params.history.push(article.url)
				const channel = client.channels.cache.get(search.channel)
				await channel.send({ embeds: [wrapper(article)] });
			}
		}
	}

	await writeJSON("./SearchParameters.json", params)
}

setInterval(running(), 60_000);