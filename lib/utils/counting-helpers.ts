import * as util from 'util'
import moment from 'moment'
import {AuthoredMessage, UserWithCountedMessages} from './interfaces'

export function cleanupMessage(split: string[]) {
  return split[1].substr(1, split[1].length).replace('\r\n', '')
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

export function messageIsUseful(messenger: string, searchTerm?: string) {
  return (
    messenger.trim().length > 0 &&
    (searchTerm
      ? messenger.toLowerCase().includes(searchTerm.toLowerCase())
      : true) &&
    messenger.trim().length > 0 &&
    !messenger.includes('<attached:') &&
    !messenger.includes(' omitted') &&
    !/.*: http[s]*:\/\//.test(messenger)
  )
}

export function getDate(line: string) {
  const split = line.split(']')
  const dateAndTime = split[0].split(' ')
  const date = dateAndTime[0].replace('[', '').replace(',', '')
  const time = dateAndTime[1]
  return moment(`${date}-${time}`, 'DD/MM/YYYY-hh:mm:ss').toDate()
}

export function organiseMessagesByAuthor(
  data: string,
  searchTerm?: string,
): {author: string; message: string; date: Date}[] {
  const content: string = util.format(data)
  return (
    content
      .split(/^\[/gm)
      //  filter out any attachments or empty lines
      .filter((line: string) => messageIsUseful(line, searchTerm))
      .map(line => {
        const split = line.split(']')
        const messageAndAuthor = split[1].trim()
        return {
          author: messageAndAuthor.split(':')[0].trim(),
          message: cleanupMessage(messageAndAuthor.split(':')),
          date: getDate(line),
        }
      })
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

  sortable.sort(function (a, b) {
    return b[1] - a[1]
  })
  return sortable
}

export function organisePhraseByAuthor(countedMessages: {
  [p: string]: CountedPhrasesByAuthor
}): {name: string; phrases: [string, number, Date][]}[] {
  return Object.keys(countedMessages).map(author => ({
    name: author,
    phrases: sortMessages(countedMessages[author]),
  }))
}

export function convertMessagesToCount(
  fileContents: string,
  searchTerm?: string,
): UserWithCountedMessages[] {
  const organisedMessages = organiseMessagesByAuthor(fileContents, searchTerm)
  const countedMessages = countMessages(organisedMessages)
  return organisePhraseByAuthor(countedMessages)
}
