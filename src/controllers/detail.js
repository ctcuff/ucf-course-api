import cheerio from 'cheerio'
import Scraper from '../util/scraper'
import logger from '../util/logger'

/**
 * Takes a list item (<li />) and extracts that list item's label
 * and title into a single object
 *
 * @param {cheerio.Root} $
 * @param {Element} li
 * @returns {{ [key: string]: string }}
 */
const parseListItem = ($, li) => {
  const title = $(li).find('span.kgoui_list_item_title').text()
  const label = $(li)
    .find('div.kgoui_list_item_label')
    .text()
    .toLowerCase()
    .trim()
    .replace(':', '')

  switch (label) {
    case 'class begins':
      return { begin: title }
    case 'class ends':
      return { end: title }
    case 'schedule':
    case 'building':
    case 'room':
    case 'instructor':
      return { [label]: title }

    default:
      logger.warn('Invalid list item', label)
      return {}
  }
}

/**
 * Parses each section and groups them into an array with each
 * section as an object
 *
 * @typedef {Object} CourseSection
 * @property {string} id
 * @property {string} begin
 * @property {string} end
 * @property {string} schedule
 * @property {string} building
 * @property {string} room
 * @property {string} instructor
 *
 * @param {cheerio.Root} $
 * @returns {CourseSection[]}
 */
const parseSections = $ => {
  // The outer div that wraps each section block
  const sectionsElements = $(
    'div.kgoui_object.kgoui_array.kgoui_list.kgo_clearfix.kgoui_list_grouped'
  )

  const sections = sectionsElements
    .map((_, element) => {
      // eslint-disable-next-line newline-per-chained-call
      const id = $(element).find('h2').text().split(' ').pop()

      // Go through each list item, extract the items title and description,
      // save it to an array of objects, then reduce that object array into
      // a single object
      const listItems = $(element)
        .find('li')
        .map((i, li) => parseListItem($, li))
        .toArray()
        .reduce((accumulator, obj) => ({ ...accumulator, ...obj }), {
          begin: '',
          end: '',
          schedule: '',
          building: '',
          room: '',
          instructor: ''
        })

      return {
        id,
        ...listItems
      }
    })
    .toArray()

  return sections
}

class Detail {
  static async getCourse(req, res) {
    const { prefix, code } = Scraper.parseCourseTitle(req.params.course)

    const html = await Scraper.getHTML('/detail', {
      term: req.query.term,
      area: prefix,
      course: `${prefix} ${code}`
    })

    const $ = cheerio.load(html, null, false)
    const detailHeader = $('div.kgo_inset.kgoui_detail_header')
    const title = detailHeader.find('h1.kgoui_detail_title').text()
    const [, courseName] = title.split(':')
    const description = detailHeader
      .find('div.kgoui_detail_description')
      .text()
      .replace(/"/g, '') // Remove all double quotes
      .replace(/\n/, ' ')

    return res.send({
      course: `${prefix} ${code}`,
      courseName,
      description,
      sections: parseSections($)
    })
  }

  static async getSection(req, res) {
    const { prefix, code } = Scraper.parseCourseTitle(req.params.course)

    const html = await Scraper.getHTML('/detail', {
      term: req.query.term,
      area: prefix,
      course: `${prefix} ${code}`
    })

    const $ = cheerio.load(html, null, false)
    const sections = parseSections($)
    const section = sections.find(item => item.id === req.params.sectionId)

    if (!section) {
      return res
        .status(404)
        .send({ error: `Couldn't find section with ID ${req.query.sectionId}` })
    }

    return res.send(section)
  }
}

export default Detail
