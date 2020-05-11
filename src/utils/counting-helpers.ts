import {AuthoredMessage} from './interfaces'

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
