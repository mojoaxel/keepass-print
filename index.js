const fs = require('fs').promises;
const path = require('path');
var kdbxweb = require('kdbxweb');

const { kdbxToJson } = require('./lib/kdbx/kdbxToJson.js');
const { getExporter } = require('./lib/exporters/index.js');

const OUTPUT_FORMATS = ['json'];

/**
 * @typedef {Object} ExportOptions
 * @param {string} outFormat keyof OUTPUT_FORMATS
 * @param {string | undefined} password
 * @param {string | undefined} keyFilePath
 * @param {boolean} verbose
 */

/**
 *
 * @param {string} databasePath
 * @param {ExportOptions} options
 * @returns {Promise<void>}
 * @async
 */
async function exportDatabase(databasePath, outputPath, options) {
	const { outFormat, password, keyFile, verbose } = options;

	//TODO: check if databasePath exists
	const databaseBuffer = (await fs.readFile(path.resolve(__dirname, databasePath))).buffer;

	const kdbxwebPassword = password ? kdbxweb.ProtectedValue.fromString(password) : null;

	const keyFilePath = keyFile ? path.resolve(__dirname, keyFile) : null;
	verbose && console.log(`keyFilePath: ${keyFilePath}`);
	const keyFileBuffer = keyFilePath ? (await fs.readFile(keyFilePath)).buffer : null;

	let credentials = new kdbxweb.Credentials(kdbxwebPassword, keyFileBuffer);

	let db;
	try {
		db = await kdbxweb.Kdbx.load(databaseBuffer, credentials);
		//verbose && console.log(`Database loaded: ${JSON.stringify(db, null, 2)}`);
	} catch (error) {
		if (error?.message?.includes('invalid key')) {
			throw new Error(`Invalid credentials`);
		}
	}

	let kdbxObject;
	try {
		kdbxObject = kdbxToJson(databasePath, db);
		//verbose && console.log(`KDBX converted to JSON: ${JSON.stringify(kdbxObject, null, 2)}`);
	} catch (error) {
		throw new Error(`Error converting database to JSON: ${error.message}`);
	}

	try {
		const Exporter = getExporter(outFormat, verbose);
		const exporter = new Exporter();
		await exporter.export(kdbxObject, outputPath, { verbose });
	} catch (error) {
		throw new Error(`Error exporting database: ${error.message}`);
	}
}

module.exports = {
	OUTPUT_FORMATS,
	exportDatabase,
};
