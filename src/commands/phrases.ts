import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'
import {countMessages, organiseMessagesByAuthor, sortMessages} from '../utils/counting-helpers'

const MAX_ENTRIES = 50

export default class Phrases extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    word: flags.string({char: 'w', description: 'Word to search'}),
    file: flags.string({
      char: 'f',
      description: 'File containing whatsapp messages',
      required: true,
    }),
    ...cli.table.flags(),
  };

  static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Phrases)

    const {word, file} = flags

    // Get all messages
    const data: string = fs.readFileSync(file, 'utf8')

    // Sort into messages by authors
    const organisedMessages = organiseMessagesByAuthor(data, /\[\d*\/\d*\/\d*, /g)
    const countedMessages = countMessages(organisedMessages)
    const sorted: { name: string; phrases: [string, number][] }[] = Object.keys(countedMessages).map(author => {
      return {
        name: author,
        phrases: sortMessages(countedMessages[author]).slice(0, MAX_ENTRIES),
      }
    })
    sorted.forEach(author => {
      this.log('\n' + author.name)
      cli.table(author.phrases, {
        phrase: {
          minWidth: 7,
          get: row => row[0],
        },
        count: {
          get: row => row[1],
        },
        id: {
          header: 'ID',
          extended: true,
        },
      })
    })
  }
}
