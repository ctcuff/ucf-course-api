import * as cheerio from 'cheerio'
import { Request, Response, NextFunction } from 'express'
import Scraper from '../util/scraper'
import logger from '../util/logger'
import ExpressError from '../util/express-error'

/**
 * Takes a list item (<li />) and extracts that list item's label
 * and title into a single object
 */
const parseListItem = (
  $: cheerio.Root,
  li: cheerio.Element
): { [key: string]: string } => {
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
 */
const parseSections = ($: cheerio.Root): CourseSection[] => {
  // The outer div that wraps each section block
  const sectionsElements = $(
    'div.kgoui_object.kgoui_array.kgoui_list.kgo_clearfix.kgoui_list_grouped'
  )

  // Take each section block and parse each list item
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

  // Need to tell TS that this is NOT a cheerio array
  // @ts-ignore
  return sections
}

class Detail {
  static async getCourse(req: Request, res: Response): Promise<Response> {
    const { prefix, code } = Scraper.parseCourseTitle(req.params.course)

    const html = await Scraper.getHTML('/detail', {
      term: req.query.term as string,
      area: prefix,
      course: `${prefix} ${code}`
    })

    const $ = cheerio.load(html)
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

  static async getSection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { prefix, code } = Scraper.parseCourseTitle(req.params.course)

    const html = await Scraper.getHTML('/detail', {
      term: req.query.term as string,
      area: prefix,
      course: `${prefix} ${code}`
    })

    const $ = cheerio.load(html)
    const sections = parseSections($)
    const section = sections.find(
      item =>
        item.id.toLocaleLowerCase() === req.params.sectionId.toLocaleLowerCase()
    )

    if (!section) {
      return next(
        new ExpressError({
          message: `Couldn't find section with ID ${req.params.sectionId}`,
          status: 404
        })
      )
    }

    return res.send(section)
  }
}

type CourseSection = {
  id: string
  begin: string
  end: string
  schedule: string
  building: string
  room: string
  instructor: string
}

export default Detail
