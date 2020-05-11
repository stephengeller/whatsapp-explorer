import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as util from 'util'
import cli from 'cli-ux'

import {cleanupMessage, addWordToCount, organiseMessagesByAuthor} from '../utils/counting-helpers'
import {Counted} from '../utils/interfaces'

const defaults = {
  wordLength: undefined,
  minWordLength: 3,
  minCount: 5,
  maxResults: 100,
}

const regex = /\[\d*\/\d*\/\d*, /g
const MIN_WORD_LENGTH = defaults.minWordLength
const MIN_COUNT = defaults.minCount
const MAX_COUNT = defaults.maxResults

export default class Words extends Command {
  static description = 'describe the command here';

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
    cli.table(words, {
      word: {
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
    }, {
      printLine: this.log,
      ...flags, // parsed flags
    })
  }

  async run() {
    const {flags} = this.parse(Words)

    const {word, file} = flags

    if (word) {
      this.log(`Searching for uses of word [${word}] in file ${file}`)
    } else {
      this.log(`Searching for most common words in file ${file}`)
    }

    // Get all messages
    const data: string = fs.readFileSync(file, 'utf8')

    // Sort into messages by authors
    const organisedMessages = organiseMessagesByAuthor(data, regex)

    // For each author, count words in each message
    const countedWordsByAuthor = this.getMostWords(organisedMessages, word)

    // If there are too many entries, prompt user
    const usersWithTooManyMessages = countedWordsByAuthor.filter(res => res.words.length > MAX_COUNT)
    if (usersWithTooManyMessages.length > 0) {
      this.log(`${usersWithTooManyMessages.map(r => `${r.words.length} results for ${r.name}`).join('\n')}`)
      const maxCount = await cli.prompt('How many should we display')
      for (const author of countedWordsByAuthor) {
        if (maxCount.match(/\d+/g)) {
          this.log(`\n${author.name}`)
          this.renderTable(author.words.slice(0, maxCount))
        }
      }
    } else {
      for (const author of countedWordsByAuthor) {
        this.log(`\n${author.name}`)
        this.renderTable(author.words)
      }
    }
  }
}
