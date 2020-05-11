import {flags} from '@oclif/command'
import * as fs from 'fs'
import cli from 'cli-ux'

import {
  addWordToCount,
  organiseMessagesByAuthor,
} from '../utils/counting-helpers'
import {Counted} from '../utils/interfaces'
import BaseCommand from '../base-commands/base'

const defaults = {
  wordLength: undefined,
  minCount: 1,
}

const MIN_WORD_LENGTH = 3
const MIN_COUNT = defaults.minCount

export default class Words extends BaseCommand {
  static description = 'Get most common words in Whatsapp chat messages';

  static flags = {
    ...BaseCommand.flags,
    'min-length': flags.integer({
      char: 'l',
      description: 'Minimum word length',
      default: MIN_WORD_LENGTH,
    }),
  };

  static args = [{name: 'file'}];

  getMostWords(
    content: { message: string; author: string }[],
    search: string | undefined
  ): { name: string; words: Counted[] }[] {
    const wordCounts: { [author: string]: { [word: string]: number } } = {}

    content.map(message =>
      message.message
      .split(/\b/)
      .filter(word => word.trim().length >= MIN_WORD_LENGTH)
      .filter(word => (search ? word.includes(search) : true))
      .map(addWordToCount(wordCounts, message))
    )

    const sortable: { [author: string]: [string, number][] } = {}

    for (const fromUser in wordCounts) {
      if (Object.prototype.hasOwnProperty.call(wordCounts, fromUser)) {
        for (const word in wordCounts[fromUser]) {
          if (!sortable[fromUser]) {
            sortable[fromUser] = []
          }
          sortable[fromUser].push([word, wordCounts[fromUser][word]])
        }
      }
    }

    return Object.keys(sortable).map(name => {
      return {
        name: name,
        words: sortable[name]
        .sort((b, a) => {
          return a[1] - b[1]
        })
        .filter(w => w[1] >= MIN_COUNT),
      }
    })
  }

  renderTable(words: Counted[]) {
    cli.table(
      words,
      {
        word: {minWidth: 7, get: row => row[0]},
        count: {get: row => row[1]},
      },
      {printLine: this.log, ...flags}
    )
  }

  async run() {
    const {flags} = this.parse(Words)
    const {word, file} = flags

    // Get all messages
    const data: string = fs.readFileSync(file, 'utf8')

    // Sort into messages by authors
    const organisedMessages = organiseMessagesByAuthor(data)

    // For each author, count words in each message
    const countedWordsByAuthor = this.getMostWords(organisedMessages, word)

    for (const author of countedWordsByAuthor) {
      this.log(`\n${author.name}`)
      this.renderTable(
        author.words
        .filter(([word, _]) => word.length >= flags['min-length'])
        .slice(0, flags.all ? author.words.length : flags['max-entries'])
      )
    }
  }
}
