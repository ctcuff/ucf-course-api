import request from 'supertest'
import app from '../../app'

const responses = {}

describe('catalog', () => {
  beforeAll(async () => {
    // Make all requests here so we don't have to wait for each
    // individual request to run
    const [catalog, area] = await Promise.all([
      request(app).get('/catalog'),
      request(app).get('/catalog/COP')
    ])

    responses.catalog = catalog
    responses.area = area
  })

  test('/catalog returns all course prefixes', async () => {
    const response = responses.catalog

    expect(response.status).toEqual(200)

    response.body.forEach(course => {
      expect(course.prefix).toEqual(expect.any(String))
      expect(course.title).toEqual(expect.any(String))
    })
  })

  test('/catalog/:area returns courses under a given area', async () => {
    const response = responses.area

    expect(response.status).toEqual(200)

    response.body.forEach(course => {
      expect(course.prefix).toEqual(expect.any(String))
      expect(course.title).toEqual(expect.any(String))
      expect(course.description).toEqual(expect.any(String))
    })
  })
})
