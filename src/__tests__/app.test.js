import request from 'supertest'
import app from '../app'
import convertTerm from '../middleware/convert-term'

describe('app', () => {
  test('errors on undefined routes', async () => {
    const response = await request(app).get('/does-not-exist')

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String)
      })
    )
  })

  test('convertTerm middleware handles term conversion', () => {
    const mockRequest = {
      query: {
        term: 'spring 2024'
      }
    }

    convertTerm(mockRequest, {}, jest.fn)
    expect(mockRequest.query.term).toEqual('1800')

    // Make sure the middleware removes the term if it can't be parsed
    mockRequest.query.term = 'someBadTerm1000'

    convertTerm(mockRequest, {}, jest.fn)
    expect(mockRequest.query.term).toBeUndefined()

    // Make sure the middleware doesn't convert the term
    // if it doesn't need to
    mockRequest.query.term = '1800'

    convertTerm(mockRequest, {}, jest.fn)
    expect(mockRequest.query.term).toEqual('1800')
  })
})
