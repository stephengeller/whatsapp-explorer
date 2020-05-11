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
whatsapp-explorer/0.0.0 darwin-x64 node-v12.16.1
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.0/src/commands/help.ts)_

## `whatsapp phrases [FILE]`

describe the command here

```
USAGE
  $ whatsapp phrases [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/phrases.ts](https://github.com/stephengeller/whatsapp-explorer/blob/v0.0.0/src/commands/phrases.ts)_

## `whatsapp words [FILE]`

describe the command here

```
USAGE
  $ whatsapp words [FILE]

OPTIONS
  -f, --file=file  (required) File containing whatsapp messages
  -h, --help       show CLI help
  -w, --word=word  Word to search
```

_See code: [src/commands/words.ts](https://github.com/stephengeller/whatsapp-explorer/blob/v0.0.0/src/commands/words.ts)_
<!-- commandsstop -->
