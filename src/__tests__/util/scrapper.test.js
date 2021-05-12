/* eslint-disable import/first */
jest.mock('node-fetch')

import fetch from 'node-fetch'
import Scraper, { BASE_URL } from '../../util/scraper'

describe('Scraper', () => {
  beforeAll(() => {
    fetch.mockImplementation(() => ({
      text: () => '<html></html>'
    }))
  })

  test('buildUrl returns the correct URL', () => {
    const params = {
      term: 1740,
      value: 'foo',
      bad: null,
      thisShouldBeIgnored: undefined
    }

    expect(Scraper.buildUrl('/catalog')).toEqual(`${BASE_URL}/catalog`)
    expect(Scraper.buildUrl('/area', params)).toEqual(
      `${BASE_URL}/area?term=1740&value=foo`
    )
  })

  test('getHTML makes request and returns HTML string', async () => {
    const html = await Scraper.getHTML('/catalog', { area: 'COP' })

    expect(html).toEqual(expect.any(String))
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/catalog?area=COP`)

    // Need to make sure this function gets called with the default value for
    // query so that branch gets covered
    await Scraper.getHTML('/some-other-route')

    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/some-other-route`)
  })

  test('parseCourseTitle returns prefix and course code', () => {
    expect(Scraper.parseCourseTitle('ABC     1000C')).toEqual({
      prefix: 'ABC',
      code: '1000C'
    })

    expect(Scraper.parseCourseTitle('ABC%201000C')).toEqual({
      prefix: 'ABC',
      code: '1000C'
    })

    expect(Scraper.parseCourseTitle('   abc   4000')).toEqual({
      prefix: 'ABC',
      code: '4000'
    })
  })

  test('parseTerm returns the correct converted term', () => {
    expect(Scraper.parseTerm('summer 2021')).toEqual('1720')
    expect(Scraper.parseTerm('spring 2024')).toEqual('1800')
    expect(Scraper.parseTerm('badTerm5000')).toEqual('')
  })
})
