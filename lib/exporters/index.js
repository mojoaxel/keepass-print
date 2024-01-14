const { JsonExporter } = require('./json/json.exporter.js');

/**
 * Exporter factory.
 * Returns a Exporter based on the given format.
 *
 * @param {string} format - keyof OUTPUT_FORMATS
 * @returns {import('./Exporter.js').Exporter} an Exporter that can export to the given format
 */
function getExporter(format) {
	switch (format) {
		case 'json':
			return JsonExporter;
		default:
			throw new Error(`No exporter for format "${format?.toUpperCase()}" found!`);
	}
}

module.exports = {
	getExporter,
};
