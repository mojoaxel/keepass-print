const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');
const prettier = require('prettier');
const qrcode = require('qrcode');

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

		// add qr-codes to kdbxObject
		const kdbxObjectWithQrCodes = await this.#addQrCodes(kdbxObject);

		const markdownString = await this.#renderTemplate(kdbxObjectWithQrCodes);
		await this.#writeOutput(markdownString, outputPath);
	}

	async #addQrCodes(kdbxObject) {
		const addQrToGroup = async groups => {
			return await Promise.all(
				groups.map(async group => {
					group.groups = await addQrToGroup(group.groups);
					group.entries = await Promise.all(
						group.entries.map(async entry => {
							const urlQr = entry.fields.URL ? await this.#getQrCode(entry.fields.URL) : null;
							const passwordQr = entry.fields.Password
								? await this.#getQrCode(entry.fields.Password)
								: null;
							entry.qrs = {
								URL: urlQr,
								Password: passwordQr,
							};
							return entry;
						})
					);
					return group;
				})
			);
		};
		kdbxObject.groups = await addQrToGroup(kdbxObject.groups);
		return kdbxObject;
	}

	async #getQrCode(text) {
		return await qrcode.toDataURL(text, {
			margin: 0,
		});
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
