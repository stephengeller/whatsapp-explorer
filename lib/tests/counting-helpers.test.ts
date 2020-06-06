import {messageIsUseful} from '../utils/counting-helpers'

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
        '‎[05/09/2019, 17:44:18] Sandy Cheeks: ‎<attached: 00000046-PHOTO-2019-09-05-17-44-18.jpg>'
      expect(messageIsUseful(message)).toBeFalsy()
    })

    it('Returns false if has a link at the start of it', function() {
      const https = '[08/09/2019, 23:14:57] Spongebob: https://youtu.be/12345'
      expect(messageIsUseful(https)).toBeFalsy()
      const http = '[08/09/2019, 23:14:57] Spongebob: http://youtu.be/12345'
      expect(messageIsUseful(http)).toBeFalsy()
    })
  })
})
