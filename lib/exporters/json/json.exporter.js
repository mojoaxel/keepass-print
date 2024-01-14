const path = require('path');
const fs = require('fs').promises;

const { Exporter } = require('../Exporter.js');

/**
 * Export the kdbx database to a JSON file.
 *
 * @extends {import('../Exporter.js').Exporter}
 */
class JsonExporter extends Exporter {
	/**
	 * @override
	 */
	async export(kdbxObject, outputPath, options = {}) {
		const { verbose } = options;
		const jsonString = JSON.stringify(kdbxObject, 0, 2);
		await this.#writeJsonOutput(jsonString, outputPath, verbose);
	}

	/**
	 * Write JSON to file
	 *
	 * @param {string} json
	 * @param {*} target
	 * @returns {Promise<void>}
	 * @async
	 */
	async #writeJsonOutput(json, outputPath, verbose) {
		//TODO: check if outputPath exists
		//TODO: is target a file or a directory? If directory, append default filename
		try {
			const targetFile = outputPath;
			await fs.writeFile(targetFile, json, 'utf8');
			verbose && console.log(`JSON output written to ${outputPath}`);
		} catch (error) {
			throw new Error(`Error writing JSON output to ${outputPath}: ${error.message}`);
		}
	}
}

module.exports = {
	JsonExporter,
};
