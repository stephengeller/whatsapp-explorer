import cli from 'cli-ux'
import * as fs from 'fs'
import {
  countMessages,
  organiseMessagesByAuthor,
  sortMessages,
} from '../utils/counting-helpers'
import BaseCommand from '../base-commands/base'
import {Counted, DataEntry} from '../utils/interfaces'

interface PhrasesByAuthor {
  name: string;
  phrases: Counted[];
}

export default class Phrases extends BaseCommand {
  static description = 'Get most common messages in Whatsapp chat';

  static flags = {...BaseCommand.flags};

  static args = [{name: 'file'}];

  async run() {
    const {flags} = this.parse(Phrases)

    // Get all messages
    const fileContents: string = fs.readFileSync(flags.file, 'utf8')

    // Sort into messages by authors
    const organisedMessages = organiseMessagesByAuthor(fileContents)
    const countedMessages = countMessages(organisedMessages)

    const sorted: PhrasesByAuthor[] = Object.keys(countedMessages).map(
      author => {
        const sortedMessages = sortMessages(countedMessages[author])
        return {
          name: author,
          phrases: sortedMessages
          .filter(([word, _]) =>
            flags.word ? word.includes(flags.word) : true
          )
          .slice(0, flags.all ? sortedMessages.length : flags['max-entries']),
        }
      }
    )

    const results: DataEntry[] = []

    sorted.forEach(author =>
      author.phrases.forEach(([phrase, count]) => {
        results.push({author: author.name, phrase, count})
      })
    )

    cli.table(
      results,
      {
        author: {get: row => row.author},
        phrase: {minWidth: 7, get: row => row.phrase},
        count: {get: row => row.count},
      },
      {...flags}
    )
  }
}
