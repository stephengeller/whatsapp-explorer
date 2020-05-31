import * as util from 'util'
import * as moment from 'moment'
import {AuthoredMessage} from './interfaces'

export function cleanupMessage(split: any[]) {
  return split[1]
    .substr(1, split[1].length)
    .replace('\r\n', '')
    .toLowerCase()
}

export function addWordToCount(
  wordCounts: {[word: string]: {[word: string]: number}},
  message: AuthoredMessage,
): (word: string | number) => void {
  return (word: string | number) => {
    if (!wordCounts[message.author]) {
      wordCounts[message.author] = {}
    }
    wordCounts[message.author][word] =
      (wordCounts[message.author][word] || 0) + 1
  }
}

export function organiseMessagesByAuthor(
  data: string,
): {author: string; message: string; date: Date}[] {
  const content: string = util.format(data)
  return (
    content
      .split(/^\[/gm)
      //  filter out any attachments or empty lines
      .filter((line: string) => {
        return (
          line.trim().length > 0 &&
          !line.includes('<attached:') &&
          !line.includes(' omitted') &&
          !/^https:\/\//.test(line)
        )
      })
      .map(line => {
        const split = line.split(']')
        const messageAndAuthor = split[1].trim()
        const dateAndTime = split[0].split(' ')
        const date = dateAndTime[0].replace('[', '').replace(',', '')
        const time = dateAndTime[1]
        const dateTime = moment(
          `${date}-${time}`,
          'DD/MM/YYYY-hh:mm:ss',
        ).toDate()
        return {
          messageAndAuthor,
          date: dateTime,
        }
      })

      //  Split by author and message
      .map(({messageAndAuthor, date}) => ({
        author: messageAndAuthor.split(':')[0].trim(),
        message: cleanupMessage(messageAndAuthor.split(':')),
        date,
      }))
  )
}

interface CountedPhrasesByAuthor {
  [phrases: string]: {count: number; date: Date}
}

export function countMessages(
  messages: AuthoredMessage[],
): {[author: string]: CountedPhrasesByAuthor} {
  const counts: {[author: string]: CountedPhrasesByAuthor} = {}
  messages.forEach(({author, message, date}) => {
    const content = message.trim()
    counts[author]
      ? counts[author][content]
        ? (counts[author][content].count += 1)
        : (counts[author][content] = {count: 1, date})
      : (counts[author] = {})
  })
  return counts
}

export function sortMessages(messages: CountedPhrasesByAuthor) {
  const sortable: [string, number, Date][] = []
  // eslint-disable-next-line guard-for-in
  for (const message in messages) {
    sortable.push([message, messages[message].count, messages[message].date])
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1]
  })
  return sortable
}

export function organisePhraseByAuthor(
  countedMessages: {[p: string]: CountedPhrasesByAuthor},
  searchWord?: string,
): {name: string; phrases: [string, number, Date][]}[] {
  return Object.keys(countedMessages).map(author => {
    const sortedAndFiltered = sortMessages(
      countedMessages[author],
    ).filter(([word, _]) =>
      searchWord ? word.toLowerCase().includes(searchWord.toLowerCase()) : true,
    )

    return {
      name: author,
      phrases: sortedAndFiltered,
    }
  })
}
