import request from 'supertest'
import fs from 'fs'
import app from '../../app'
import Scraper from '../../util/scraper'

describe('detail', () => {
  beforeEach(() => {
    // Mock getHTML to return the associated html response file instead of
    // actually making a request each time the function is called
    jest.spyOn(Scraper, 'getHTML').mockImplementation((path, query) => {
      try {
        // Convert the course from "ENC 1101" to "ENC1101"
        const course = query.course.replace(/\s+/, '')
        const data = fs.readFileSync(`src/__mocks__/${course}.html`, 'utf-8')

        return data
      } catch (err) {
        return ''
      }
    })
  })

  test('/detail/:course returns detail for given course', async () => {
    const response = await request(app).get('/detail/ENC1101')

    expect(response.status).toEqual(200)
    expect(response.body.course).toEqual('ENC 1101')
    expect(response.body.courseName).toEqual('Composition I')
    expect(response.body.description).toEqual(expect.any(String))
    expect(response.body.sections).toEqual(expect.any(Array))

    // Ensure each section has at least an ID
    response.body.sections.forEach(section => {
      expect(section.id).toEqual(expect.any(String))
    })
  })

  test('/detail/:course handles unknown courses', async () => {
    const response = await request(app).get('/detail/ABC2000')

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String)
      })
    )
  })

  test('/detail/:course/sections/:sectionId returns single section', async () => {
    const response = await request(app).get('/detail/ENC1101/sections/A602')

    expect(response.body).toEqual(
      expect.objectContaining({
        begin: expect.any(String),
        end: expect.any(String),
        schedule: expect.any(String),
        instructor: expect.any(String)
      })
    )
  })

  test('/detail/:course/sections/:sectionId handles invalid sections', async () => {
    const response = await request(app).get('/detail/ENC1101/sections/badId')

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String)
      })
    )
  })
})
