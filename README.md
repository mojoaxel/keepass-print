# keepass-print

Print password list from a keepass database for long-term backup.

## Setup

To use `keepass-print` as a cli tool install it globally:

```
npm install -g keepass-print
```

## Usage

### command-line-interface (CLI)

```
$> keepass-print --help
Usage: keepass-print [options] <database> <output>

Print password list from a keepass database for long-term backup.

Arguments:
  database                 path to the kdbx database file
  output                   path to the output file

Options:
  -V, --version            output the version number
  --password [password]    password to access the database
  --outFormat [outFormat]  supported output formats (["json", "markdown"]) (default: "json")
  --key [keyFile]          path to the key-file to access the database
  --verbose                verbose output (default: false)
  -h, --help               display help for command
```

#### Examples

Basic usage (export json):
```
$> keepass-print ./test/fixtures/test_database.kdbx ./test/output/test_database.json
```

Provide the password as parameter:
```
$> keepass-print --password "pass123" ./test/fixtures/test_database.kdbx ./test/output/test_database.json
```

Provide a key-file instead of a password:
```
$> keepass-print --key ./secret/key ./test/fixtures/test_database.kdbx ./test/output/test_database.json
```

Export as Markdown:
```
$> keepass-print --outFormat markdown ./test/fixtures/test_database.kdbx ./test/output/test_database.md
```

## Legal

- Copyright 2024 by [Alexander Wunschik](https://github.com/mojoaxel), all rights reserved.
- Licensed under a [AGPL-3.0](LICENSE) license.

