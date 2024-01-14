/**
 * @typedef {Object} ExporterOptions
 * @param {boolean} verbose
 */

/**
 * @class Exporter
 * @abstract
 */
class Exporter {
	/**
	 * Exports the given kdbx object to the given output path.
	 *
	 * @param {import('../kdbx/kdbxToJson.js').JsonKdbxData} kdbxObject - the kdbx object to export
	 * @param {string} outputPath - path to output file
	 * @param {ExporterOptions} [options]
	 */
	async export(_kdbxObject, _outputPath, _options = {}) {
		throw new Error('This method must be implemented by a subclass');
	}
}

module.exports = {
	Exporter,
};
