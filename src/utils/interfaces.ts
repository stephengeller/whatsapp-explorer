export interface AuthoredMessage {
  message: string;
  author: string;
}

export type Counted = [string, number];

export interface DataEntry {
  author: string;
  word?: string;
  phrase?: string;
  count: number;
}
