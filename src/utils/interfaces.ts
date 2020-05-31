export interface AuthoredMessage {
  message: string
  author: string
  date: Date
}

export type Counted = [string, number, Date]

export interface DataEntry {
  author: string
  word?: string
  phrase?: string
  count: number
  date: Date
}
