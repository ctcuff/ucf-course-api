import request from 'supertest'
import app from '../app'

describe('app', () => {
  test('"/catalog" returns all course prefixes', async () => {
    const response = await request(app).get('/catalog')

    expect(response.status).toEqual(200)

    response.body.forEach(course => {
      expect(course.prefix).toEqual(expect.any(String))
      expect(course.title).toEqual(expect.any(String))
    })
  })
})
