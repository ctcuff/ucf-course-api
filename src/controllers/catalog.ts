import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import Scraper from '../util/scraper'

class Catalog {
  static async getAll(req: Request, res: Response): Promise<Response> {
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

    return res.send(result)
  }

  static async getArea(req: Request, res: Response): Promise<Response> {
    const html = await Scraper.getHTML('/catalog', {
      area: req.params.area,
      term: req.query.term as string
    })
    const $ = cheerio.load(html)
    const listElement = $(
      'li[data-type="content"] div.kgoui_list_item_textblock'
    )

    const result = listElement
      .map((_, element) => {
        const prefix = $(element).find('div.kgoui_list_item_label').text()
        const title = $(element).find('span.kgoui_list_item_title').text()
        const description = $(element)
          .find('div.kgoui_list_item_subtitle')
          .text()
          .replace(/"/g, '') // Remove all double quotes
          .replace(/\n/, ' ')

        return {
          prefix,
          title,
          description
        }
      })
      .toArray()

    return res.send(result)
  }
}

export default Catalog
