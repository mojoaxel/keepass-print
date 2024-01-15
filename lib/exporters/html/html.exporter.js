const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');
const prettier = require('prettier');

const { Exporter } = require('../Exporter.js');

/**
 * Export the kdbx database to a HTML file.
 *
 * @extends {import('../Exporter.js').Exporter}
 */
class HtmlExporter extends Exporter {
	verbose = false;

	/**
	 * Exports the given kdbx object to the given output path.
	 *
	 * @param {import('../kdbx/kdbxToJson.js').JsonKdbxData} kdbxObject - the kdbx object to export
	 * @param {string} outputPath - path to output file
	 * @param {ExporterOptions} [options]
	 * @override
	 */
	async export(kdbxObject, outputPath, options = {}) {
		this.verbose = options.verbose;
		this.verbose && console.log(`Saving as Markdown to "${outputPath}"`);
		const markdownString = await this.#renderTemplate(kdbxObject);
		await this.#writeOutput(markdownString, outputPath);
	}

	async #renderTemplate(data) {
		const templateDir = path.join(__dirname, 'templates');
		const templatePath = path.join(templateDir, './html.ejs');
		const template = await fs.readFile(templatePath, 'utf8');

		const htmlString = ejs.render(template, data, {
			filename: templatePath,
			root: templateDir,
		});

		const htmlCleaned = htmlString
			// remove html comments
			.replace(/<!--.*-->/g, '');

		const htmlFormatted = await prettier.format(htmlCleaned, { parser: 'html' });
		return htmlFormatted;
	}

	async #writeOutput(markdownString, outputPath) {
		await fs.writeFile(outputPath, markdownString, 'utf8');
	}
}

module.exports = {
	HtmlExporter,
};
