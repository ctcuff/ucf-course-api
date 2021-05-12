import fetch from 'node-fetch'
import logger from './logger'

const BASE_URL =
  'https://centralflorida-prod.modolabs.net/student/course_search_prod'

class Scraper {
  /**
   * Takes a path and builds a URL from that path appending
   * any optional query params if passed (note that all query
   * params will be encoded)
   */
  static buildUrl(
    path: string,
    query: { [key: string]: string | number } = {}
  ): string {
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
   */
  static async getHTML(
    path: string,
    query: { [key: string]: string | number } = {}
  ): Promise<string> {
    const url = Scraper.buildUrl(path, query)
    const response = await fetch(url)
    const html = await response.text()

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`Request to ${url}`)
    }

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
   */
  static parseCourseTitle(title: string): { prefix: string; code: string } {
    const course = decodeURIComponent(title.trim())

    const prefix = course
      .substring(0, 3)
      .trim()
      .replace(/\s+/, '')
      .toUpperCase()
    const code = course.substring(3).trim().replace(/\s+/, '').toUpperCase()

    return { prefix, code }
  }

  /**
   * Takes the name and year of a term and converts it to the code for that
   * term used by UCF. We do this by taking the semester and finding the
   * difference multiplied by 10 and offset by a factor of 30.
   *
   * Example:
   * ```
   * parseTerm('spring2021') === '1710'
   * parseTerm('fall 2022') === '1760'
   * ```
   */
  static parseTerm(term: string): string {
    const baseTerm = 1710
    const baseYear = 2021
    const terms = ['spring', 'summer', 'fall']

    const termCode = term.toLocaleLowerCase().trim().replace(/\s+/, '')

    const name = termCode.substring(0, termCode.length - 4)
    const year = parseInt(termCode.substring(termCode.length - 4), 10)

    let termDiff = terms.indexOf(name)

    if (termDiff === -1 || Number.isNaN(year)) {
      return ''
    }

    termDiff *= 10

    const yearDiff = year - baseYear

    return `${baseTerm + (termDiff + yearDiff * 30)}`
  }
}

export { Scraper as default, BASE_URL }
