whatsapp-explorer
=================

Tool to explore whatsapp messages

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/whatsapp-explorer.svg)](https://npmjs.org/package/whatsapp-explorer)
[![Downloads/week](https://img.shields.io/npm/dw/whatsapp-explorer.svg)](https://npmjs.org/package/whatsapp-explorer)
[![License](https://img.shields.io/npm/l/whatsapp-explorer.svg)](https://github.com/stephengeller/whatsapp-explorer/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g whatsapp-explorer
$ whatsapp COMMAND
running command...
$ whatsapp (-v|--version|version)
whatsapp-explorer/0.1.3 darwin-x64 node-v12.16.1
$ whatsapp --help [COMMAND]
USAGE
  $ whatsapp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`whatsapp help [COMMAND]`](#whatsapp-help-command)
* [`whatsapp phrases [FILE]`](#whatsapp-phrases-file)
* [`whatsapp words [FILE]`](#whatsapp-words-file)

## `whatsapp help [COMMAND]`

display help for whatsapp

```
USAGE
  $ whatsapp help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src/commands/help.ts)_

## `whatsapp phrases [FILE]`

Get most common messages in Whatsapp chat

```
USAGE
  $ whatsapp phrases [FILE]

OPTIONS
  -M, --max-entries=max-entries  [default: 10] Number of entries to display
  -a, --all                      Show all results
  -f, --file=file                (required) File containing whatsapp messages
  -h, --help                     show CLI help
  -l, --min-length=min-length    [default: 1] Minimum phrase length
  -w, --word=word                Word to search
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --csv                          output is csv format [alias: --output=csv]
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)
```

_See code: [src/commands/phrases.ts](https://github.com/stephengeller/whatsapp-explorer/blob/v0.1.3/src/commands/phrases.ts)_

## `whatsapp words [FILE]`

Get most common words in Whatsapp chat messages

```
USAGE
  $ whatsapp words [FILE]

OPTIONS
  -M, --max-entries=max-entries  [default: 10] Number of entries to display
  -a, --all                      Show all results
  -f, --file=file                (required) File containing whatsapp messages
  -h, --help                     show CLI help
  -l, --min-length=min-length    [default: 3] Minimum word length
  -w, --word=word                Word to search
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --csv                          output is csv format [alias: --output=csv]
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)
```

_See code: [src/commands/words.ts](https://github.com/stephengeller/whatsapp-explorer/blob/v0.1.3/src/commands/words.ts)_
<!-- commandsstop -->
