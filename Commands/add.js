const { SlashCommandBuilder } = require('discord.js');
const { readAndParseJSON, writeJSON } = require('../services.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Adds new search')
		.addStringOption(option =>
			option
				.setName('category')
				.setDescription('Specifies the Item category to search.')
				.addChoices(
					{ name: 'Headphones', value: 'casques-audio' },
					{ name: 'Laptops', value: 'pc-portables' },
				)
		)
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('Used to search for a specific item. If ignored, the whole category is searched.')),
	async execute(interaction) {
		const params = await readAndParseJSON("./SearchParameters.json")
		const added = {
			channel: interaction.channel.id,
			category: interaction.options.getString('category'),
			name: interaction.options.getString('name'),
		}
		params.searches.push(added)
		await writeJSON("./SearchParameters.json", params)
		interaction.reply('Search added!');
	},
};