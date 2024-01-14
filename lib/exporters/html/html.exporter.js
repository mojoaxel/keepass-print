const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');

const { Exporter } = require('../Exporter.js');

/**
 * Export the kdbx database to a HTML file.
 *
 * @extends {import('../Exporter.js').Exporter}
 */
class HtmlExporter extends Exporter {
	/**
	 * Exports the given kdbx object to the given output path.
	 *
	 * @param {import('../kdbx/kdbxToJson.js').JsonKdbxData} kdbxObject - the kdbx object to export
	 * @param {string} outputPath - path to output file
	 * @param {ExporterOptions} [options]
	 * @override
	 */
	async export(kdbxObject, outputPath, options = {}) {
		const { verbose } = options;
		verbose && console.log(`Saving as Markdown to "${outputPath}"`);
		const markdownString = await this.#renderTemplate(kdbxObject);
		await this.#writeOutput(markdownString, outputPath, verbose);
	}

	async #renderTemplate(data) {
		const templatePath = path.join(__dirname, './html.template.ejs');
		const template = await fs.readFile(templatePath, 'utf8');
		return ejs.render(template, data);
	}

	async #writeOutput(markdownString, outputPath, verbose) {
		await fs.writeFile(outputPath, markdownString, 'utf8');
	}
}

module.exports = {
	HtmlExporter,
};
