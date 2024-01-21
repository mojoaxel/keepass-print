#!/bin/env node

const path = require('path');
const fs = require('fs/promises');
const { program } = require('commander');
const prompts = require('prompts');

const PKG = require('../package.json');
const { exportDatabase, SUPPORTED_OUTPUT_FORMATS } = require('../index.js');
const outputFormats = SUPPORTED_OUTPUT_FORMATS.map(format => `"${format}"`).join(', ');

async function main() {
	program
		.version(PKG.version)
		.description(`${PKG.description}.`)
		.option('--outFormat [outFormat]', `supported output formats ([${outputFormats}])`, 'json')
		.option('--password [password]', 'password to access the database')
		.option('--key [keyFile]', 'path to the key-file to access the database')
		.option('--verbose', 'verbose output', false)
		.argument('<database>', 'path to the kdbx database file')
		.argument('<output>', 'path to the output file')
		.parse();

	const options = program.opts();
	const { outFormat, key, verbose } = options;
	verbose && console.log(`options: ${JSON.stringify(options, null, 2)}`);

	const [database, output] = program.processedArgs;
	verbose && console.log(`database: ${database}`);

	// get path the cool was called from
	const cwd = process.cwd();

	// check if database exists
	const databaseAbsPath = path.resolve(cwd, database);
	verbose && console.log(`databaseAbsPath: ${databaseAbsPath}`);
	await fs.access(databaseAbsPath, fs.constants.F_OK).catch(() => {
		console.error(`KDBX database file "${database}" not found!`);
		return process.exit(1);
	});

	// check if outputDir exists
	const outputAbsPath = path.resolve(cwd, output);
	verbose && console.log(`outputAbsPath: ${outputAbsPath}`);
	const outputDir = path.dirname(outputAbsPath);
	verbose && console.log(`outputDir: ${outputDir}`);
	try {
		await fs.stat(outputDir);
	} catch (error) {
		const response = await prompts({
			type: 'confirm',
			name: 'create',
			message: [
				`Output directory "${path.dirname(output)}" does not exist!`,
				`Do you want to create it?`,
			].join(' '),
		});
		if (response.create) {
			await fs.mkdir(outputDir, { recursive: true });
		} else {
			return process.exit(1);
		}
	}

	let password = options.password;
	let keyFileAbsPath;

	// if the password is not provided, ask the user
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
	} else {
		// check if key-file exists
		keyFileAbsPath = path.resolve(cwd, key);
		verbose && console.log(`keyFileAbsPath: ${keyFileAbsPath}`);
		await fs.access(keyFileAbsPath, fs.constants.F_OK).catch(() => {
			console.error(`Key-file "${key}" not found!`);
			return process.exit(1);
		});
	}

	/**
	 * @type {import(../index.js).ExportOptions}
	 */
	const exportOptions = {
		outFormat,
		password,
		keyFile: keyFileAbsPath,
		verbose,
	};

	try {
		await exportDatabase(databaseAbsPath, outputAbsPath, exportOptions);
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
}

(async () => {
	await main();
})();
