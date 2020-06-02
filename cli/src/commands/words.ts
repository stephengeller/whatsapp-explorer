import {flags} from '@oclif/command'
import * as fs from 'fs'
import cli from 'cli-ux'

import {
  addWordToCount,
  organiseMessagesByAuthor,
} from 'whatsapp-explorer-lib/dist/utils/counting-helpers'
import BaseCommand from '../base-commands/base'

const defaults = {
  wordLength: undefined,
  minCount: 1,
}

const MIN_WORD_LENGTH = 3
const MIN_COUNT = defaults.minCount

export default class Words extends BaseCommand {
  static description = 'Get most common words in Whatsapp chat messages'

  static flags = {
    ...BaseCommand.flags,
    'min-length': flags.integer({
      char: 'l',
      description: 'Minimum word length',
      default: MIN_WORD_LENGTH,
    }),
  }

  static args = [{name: 'file'}]

  private createData(
    content: {author: string; message: string; date: Date}[],
    search: string | undefined,
  ): {author: string; word: string; count: number}[] {
    const wordCounts: {[author: string]: {[word: string]: number}} = {}

    content.map(message =>
      message.message
        .split(/\b/)
        .filter(word => word.trim().length >= MIN_WORD_LENGTH)
        .filter(word => (search ? word.includes(search) : true))
        .map(addWordToCount(wordCounts, message)),
    )

    const sortable: {author: string; word: string; count: number}[] = []

    for (const fromUser in wordCounts) {
      if (Object.prototype.hasOwnProperty.call(wordCounts, fromUser)) {
        for (const word in wordCounts[fromUser]) {
          if (
            Object.prototype.hasOwnProperty.call(wordCounts[fromUser], word)
          ) {
            sortable.push({
              author: fromUser,
              word,
              count: wordCounts[fromUser][word],
            })
          }
        }
      }
    }

    return sortable
      .sort((b, a) => {
        return a.count - b.count
      })
      .filter(w => w.count >= MIN_COUNT)
  }

  async run() {
    const {flags} = this.parse(Words)
    const {word, file} = flags

    // Get all messages
    const fileContents: string = fs.readFileSync(file, 'utf8')

    // Sort into messages by authors
    const organisedMessages = organiseMessagesByAuthor(fileContents, word)

    // For each author, count words in each message
    const data = this.createData(organisedMessages, word)
    cli.table(
      data
        .filter(({word}) => word && word.length >= flags['min-length'])
        .slice(0, flags.all ? data.length : flags['max-entries']),
      {
        author: {get: row => row.author},
        word: {minWidth: 7, get: row => row.word},
        count: {get: row => row.count},
      },
      {printLine: this.log, ...flags},
    )
  }
}
