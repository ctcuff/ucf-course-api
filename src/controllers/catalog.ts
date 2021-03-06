import * as cheerio from 'cheerio'
import { NextFunction, Request, Response } from 'express'
import ExpressError from '../util/express-error'
import Scraper from '../util/scraper'

class Catalog {
  static async getAll(req: Request, res: Response): Promise<void> {
    const html = await Scraper.getHTML('/catalog', {
      term: req.query.term as string
    })
    const $ = cheerio.load(html)
    const listElement = $(
      'li[data-type="content"] div.kgoui_list_item_textblock'
    )

    const result = listElement
      .map((_, element) => {
        const children = $(element).children()

        return {
          prefix: $(children.first()).text(),
          title: $(children.last()).text()
        }
      })
      .toArray()

    res.send(result)
  }

  static async getArea(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const html = await Scraper.getHTML('/catalog', {
      area: req.params.area,
      term: req.query.term as string
    })
    const $ = cheerio.load(html)
    const pageHeader = $('h2#kgoui_Rcontent_I0_Rcontent_I1_heading')
    const listElement = $(
      'li[data-type="content"] div.kgoui_list_item_textblock'
    )

    // Generally, the page header element will only be present
    // if the area actually exists
    if (pageHeader.length === 0) {
      next(
        new ExpressError({
          message: `No courses under ${req.params.area}`,
          status: 404
        })
      )

      return
    }

    const result = listElement
      .map((_, element) => {
        const prefix = $(element).find('div.kgoui_list_item_label').text()
        const title = $(element).find('span.kgoui_list_item_title').text()
        const description = $(element)
          .find('div.kgoui_list_item_subtitle')
          .text()
          .replace(/"/g, '') // Remove all double quotes
          .replace(/\n/, ' ')
          .trim()

        return {
          prefix,
          title,
          description
        }
      })
      .toArray()

    res.send(result)
  }
}

export default Catalog
