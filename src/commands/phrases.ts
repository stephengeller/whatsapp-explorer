import {flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'

import {
  countMessages,
  organiseMessagesByAuthor,
  organisePhraseByAuthor,
} from '../utils/counting-helpers'
import BaseCommand from '../base-commands/base'
import {Counted, DataEntry} from '../utils/interfaces'

interface PhrasesByAuthor {
  name: string
  phrases: Counted[]
}

export default class Phrases extends BaseCommand {
  static description = 'Get most common messages in Whatsapp chat'

  static flags = {
    ...BaseCommand.flags,
    'min-length': flags.integer({
      description: 'Minimum phrase length',
      char: 'l',
      default: 1,
    }),
  }

  static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Phrases)

    // Get all messages
    const fileContents: string = fs.readFileSync(flags.file, 'utf8')

    // Sort into messages by authors
    const organisedMessages = organiseMessagesByAuthor(fileContents)
    const countedMessages = countMessages(organisedMessages)

    const sorted: PhrasesByAuthor[] = organisePhraseByAuthor(
      countedMessages,
      flags.word,
    )

    const results: DataEntry[] = []

    sorted.forEach(author =>
      author.phrases.forEach(([phrase, count]) => {
        results.push({author: author.name, phrase, count})
      }),
    )

    cli.table(
      results
        .filter(
          entry => entry.phrase && entry.phrase.length >= flags['min-length'],
        )
        .sort((b, a) => a.count - b.count)
        .slice(0, flags.all ? undefined : flags['max-entries']),
      {
        author: {get: row => row.author},
        phrase: {minWidth: 7, get: row => row.phrase},
        count: {get: row => row.count},
      },
      {...flags},
    )
  }
}
