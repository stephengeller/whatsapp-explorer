import {AuthoredMessage} from './interfaces'
import * as util from 'util'

export function cleanupMessage(split: any[]) {
  return split[1].substr(1, split[1].length).replace('\r\n', '').toLowerCase()
}

export function addWordToCount(
  wordCounts: { [word: string]: { [word: string]: number } },
  message: AuthoredMessage
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
  regex: RegExp
): {
  author: string;
  message: string;
}[] {
  const content: string = util.format(data)
  return (
    content
    .split(regex)
    //  Split by after end of datetime
    .map((line: string) => line.substr(line.indexOf('] ') + 2, line.length))
    //  filter out any attachments or empty lines
    .filter(
      (line: string | string[]) =>
        line.length > 0 && !line.includes('<attached:') && !line.includes(' omitted')
    )
    //  Split by author and message
    .map((line: string) => ({
      author: line.split(':')[0],
      message: cleanupMessage(line.split(':')),
    }))
  )
}

interface CountedPhrasesByAuthor {
  [phrases: string]: number;
}

export function countMessages(
  messages: AuthoredMessage[]
): { [author: string]: CountedPhrasesByAuthor } {
  const counts: { [author: string]: CountedPhrasesByAuthor } = {}
  messages.forEach(({author, message}) => {
    const content = message.trim()
    counts[author] ?
      counts[author][content] ?
        (counts[author][content] += 1) :
        (counts[author][content] = 1) :
      (counts[author] = {})
  })
  return counts
}

export function sortMessages(messages: CountedPhrasesByAuthor) {
  const sortable: [string, number][] = []
  for (const message in messages) {
    sortable.push([message, messages[message]])
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1]
  })
  return sortable
}
