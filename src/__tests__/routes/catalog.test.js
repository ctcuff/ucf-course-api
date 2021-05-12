import request from 'supertest'
import fs from 'fs'
import app from '../../app'
import Scraper from '../../util/scraper'

describe('catalog', () => {
  beforeAll(async () => {
    // Mock getHTML to return the associated html response file instead of
    // actually making a request each time the function is called
    jest.spyOn(Scraper, 'getHTML').mockImplementation((path, query) => {
      try {
        const filename = (query.area && query.area.toUpperCase()) || path
        const data = fs.readFileSync(`src/__mocks__/${filename}.html`, 'utf-8')

        return data
      } catch (err) {
        return ''
      }
    })
  })

  test('/catalog returns all course prefixes', async () => {
    const response = await request(app).get('/catalog')

    expect(response.status).toEqual(200)

    response.body.forEach(course => {
      expect(course.prefix).toEqual(expect.any(String))
      expect(course.title).toEqual(expect.any(String))
    })
  })

  test('/catalog/:area returns courses under a given area', async () => {
    const response = await request(app).get('/catalog/COP')

    expect(response.status).toEqual(200)

    response.body.forEach(course => {
      expect(course.prefix).toEqual(expect.any(String))
      expect(course.title).toEqual(expect.any(String))
      expect(course.description).toEqual(expect.any(String))
    })
  })

  test('/catalog/:area handles invalid area', async () => {
    const response = await request(app).get('/catalog/ABC')

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String)
      })
    )
  })
})
