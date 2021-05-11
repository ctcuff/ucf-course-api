import fetch from 'node-fetch'

const BASE_URL =
  'https://centralflorida-prod.modolabs.net/student/course_search_prod'

class Scraper {
  /**
   * Takes a path and builds a URL from that path appending
   * any optional query params if passed (note that all query
   * params will be encoded)
   *
   * @param {string} path
   * @param {Object<string, string | number>?} query
   * @returns {string}
   */
  static buildUrl(path, query = {}) {
    const searchParams = Object.entries(query)
      .filter(([key, value]) => !!key && value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    if (searchParams.trim().length > 0) {
      return `${BASE_URL}${path}?${searchParams}`
    }

    return `${BASE_URL}${path}`
  }

  /**
   * Makes a request to the UCF course site and returns the page's HTML
   * @param {string} path
   * @param {Object<string, string | number>?} query
   * @returns {string}
   */
  static async getHTML(path, query = {}) {
    const url = Scraper.buildUrl(path, query)
    const response = await fetch(url)
    const html = response.text()

    return html
  }

  /**
   * Takes a course string and splits it so that it can be encoded properly.
   * If the string is already the input is returned.
   *
   * Example:
   * ```
   * parseCoursePrefix('ENC1101') === { prefix: 'ENC', code: '1101' }
   * parseCoursePrefix('ENC%201101') === { prefix: 'ENC', code: '1101' }
   * ```
   *
   * @param {string} str
   * @returns {{ prefix: string, code: string }}
   */
  static parseCourseTitle(str) {
    const course = decodeURIComponent(str.trim())

    // This string is already properly encoded if it has a space between
    // the course title and course code
    if (course.substring(3, 6) === '%20') {
      return course
    }

    const prefix = course.substring(0, 3).trim().replace(/\s+/, '')
    const code = course.substring(3).trim().replace(/\s+/, '')

    return { prefix, code }
  }
}

export { Scraper as default, BASE_URL }
