#!/bin/env node

const path = require('path');
const { program } = require('commander');
const prompts = require('prompts');

const PKG = require('../package.json');
const { exportDatabase, OUTPUT_FORMATS } = require('../index.js');
const outputFormats = OUTPUT_FORMATS.map(format => `"${format}"`).join(', ');

(async () => {
	program
		.version(PKG.version)
		.description(`${PKG.description}.`)
		.option('--password [password]', 'password to access the database')
		//.option('--noteFormat [noteFormat]', 'format of the notes (default: markdown)', 'markdown')
		.option('--outFormat [outFormat]', `supported output formats ([${outputFormats}])`, 'json')
		.option('--key [keyFile]', 'path to the key-file to access the database')
		.option('--verbose', 'verbose output', false)
		.argument('<database>', 'path to the kdbx database file')
		.argument('<output>', 'path to the output file')
		.parse();

	const options = program.opts();
	const { outFormat, key, verbose } = options;
	verbose && console.log(`options: ${JSON.stringify(program.opts(), null, 2)}`);

	const [database, output] = program.processedArgs;
	verbose && console.log(`database: ${database}`);

	let password = options.password;
	if (!key) {
		if (!password) {
			verbose && console.log(`No key-file and no password provided. Asking user...`);
			const response = await prompts({
				type: 'password',
				name: 'password',
				message: 'Please enter the password to access the database',
			});
			password = response.password;
		}
	}

	/**
	 * @type {import(../index.js).ExportOptions}
	 */
	const exportOptions = {
		outFormat,
		password,
		keyFile: key,
		verbose,
	};

	try {
		await exportDatabase(database, output, exportOptions);
		console.log(
			`Successfully exported database "${path.basename(
				database
			)}" as "${outFormat.toUpperCase()}" to "${output}"!`
		);
	} catch (error) {
		console.error(
			`Error exporting database "${path.basename(
				database
			)}" as "${outFormat.toUpperCase()}" to "${output}": `,
			error.message
		);
		return process.exit(1);
	}
})();
