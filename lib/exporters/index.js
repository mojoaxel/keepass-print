const { JsonExporter } = require('./json/json.exporter.js');
const { MarkdownExporter } = require('./markdown/markdown.exporter.js');
const { HtmlExporter } = require('./html/html.exporter.js');

const SUPPORTED_OUTPUT_FORMATS = ['json', 'markdown', 'html'];

/**
 * Exporter factory.
 * Returns a Exporter based on the given format.
 *
 * @param {string} format - keyof SUPPORTED_OUTPUT_FORMATS
 * @returns {import('./Exporter.js').Exporter} an Exporter that can export to the given format
 */
function getExporter(format) {
	switch (format.toLowerCase()) {
		case 'json':
			return JsonExporter;
		case 'markdown':
		case 'md':
			return MarkdownExporter;
		case 'html':
			return HtmlExporter;
		default:
			throw new Error(
				[
					`No exporter for format "${format?.toUpperCase()}" found!`,
					`Supported formats are: [${SUPPORTED_OUTPUT_FORMATS.join(', ')}]`,
				].join()
			);
	}
}

module.exports = {
	SUPPORTED_OUTPUT_FORMATS,
	getExporter,
};
