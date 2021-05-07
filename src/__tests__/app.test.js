import request from 'supertest'
import app from '../app'

describe('app', () => {
  test('"/" returns the default response', async () => {
    const response = await request(app).get('/')

    expect(response.body).toEqual({ response: 'OK' })
    expect(response.status).toEqual(200)
  })
})
