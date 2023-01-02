const { Builder, By, Key, until } = require("selenium-webdriver");

const aritcles_path = "//*[@id='toc-target-deals']/div[1]/article"
const title_path = ".//strong/a"
const price_path = ".//span[@class='thread-price text--b cept-tp size--all-l size--fromW3-xl']"
const pic_path = ".//div[@class='threadGrid-image space--r-3']//img"

async function openDealabs(BaseURL, Category) {
	let driver = await new Builder()
		.forBrowser('chrome')
		.build();
	try {
		// Navigate to the website
		await driver.get(`${BaseURL}/${Category}`);
		const elements = await driver.findElements(By.xpath(aritcles_path));

		const articles = [];
		for (let element of elements) {
			try {
				const title = await element.findElement(By.xpath(title_path)).getAttribute("innerText");
				const url = await element.findElement(By.xpath(title_path)).getAttribute("href");
				const price = await element.findElement(By.xpath(price_path)).getAttribute("innerText");
				const pic = await element.findElement(By.xpath(pic_path)).getAttribute("src");

				const article = {
					title,
					url,
					price: parseFloat(price.slice(0, -1)),
					pic,
				}
				articles.push(article);
			}
			catch {
				//unavailable article
			}
		}
		return (articles)
	}
	finally {
		await driver.quit();
	}
}

module.exports = { openDealabs }