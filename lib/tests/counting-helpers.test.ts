import {
  getDate,
  messageIsUseful,
  convertMessagesToCount,
} from '../utils/counting-helpers'

describe('countingHelpers', function() {
  describe('lineIsUseful', function() {
    const message = `[28/09/2019, 15:03:43] Sandy Cheeks: I love chocolate!`
    it('Returns true if search term in message', function() {
      const searchTerm = 'chocolate'

      expect(messageIsUseful(message, searchTerm)).toBeTruthy()
    })

    it('Returns false if search term missing in message', function() {
      const searchTerm = 'milk'

      expect(messageIsUseful(message, searchTerm)).toBeFalsy()
    })

    it('Returns false if empty string', function() {
      expect(messageIsUseful('     ')).toBeFalsy()
    })

    it('Returns false if has an attachment in it', function() {
      const message =
        '‎[05/09/2019, 17:44:18] Sandy Cheeks: ‎<attached: 00000046-PHOTO-"2019-09-05-17-44-18.jpg>"'
      expect(messageIsUseful(message)).toBeFalsy()
    })

    it('Returns false if has a link at the start of it', function() {
      const https = '[08/09/2019, 23:14:57] Spongebob: https://youtu.be/12345'
      expect(messageIsUseful(https)).toBeFalsy()
      const http = '[08/09/2019, 23:14:57] Spongebob: http://youtu.be/12345'
      expect(messageIsUseful(http)).toBeFalsy()
    })
  })

  describe('getDate', function() {
    it('given a message, should return a date', function() {
      const message = '‎[01/02/2001, 11:22:33] Sandy Cheeks: Hello'
      expect(getDate(message)).toEqual(new Date(2001, 1, 1, 11, 22, 33))
    })

    it('works for PM as well as AM', function() {
      const message = '‎[01/02/2001, 22:22:33] Sandy Cheeks: Hello'
      expect(getDate(message)).toEqual(new Date(2001, 1, 1, 22, 22, 33))
    })
  })

  describe('convertMessagesToCount', function() {
    it('should take a string of messages and convert them into a list of users', function() {
      const messages = `
[08/09/2019, 23:15:12] User1: message2
[08/09/2019, 23:15:13] User1: message3
[08/09/2019, 23:15:14] User1: message3
[08/09/2019, 23:15:15] User1: message1
[08/09/2019, 23:15:15] User1: message1
[08/09/2019, 23:15:16] User1: message1
[08/09/2019, 23:15:17] User2: message4
[08/09/2019, 23:15:18] User2: message5
[08/09/2019, 23:15:19] User2: message6
[08/09/2019, 23:15:20] User2: message6
[08/09/2019, 23:15:21] User2: message6
[08/09/2019, 23:15:23] User2: message6
`
      const results = convertMessagesToCount(messages)
      expect(results).toEqual([
        {
          name: 'User1',
          phrases: [
            ['message1', 3, new Date('2019-09-08T22:15:15.000Z')],
            ['message3', 2, new Date('2019-09-08T22:15:13.000Z')],
          ],
        },
        {
          name: 'User2',
          phrases: [
            ['message6', 4, new Date('2019-09-08T22:15:19.000Z')],
            ['message5', 1, new Date('2019-09-08T22:15:18.000Z')],
          ],
        },
      ])
    })
  })
})
