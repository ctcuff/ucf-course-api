import fetch from 'node-fetch'

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
}

export default Scraper
