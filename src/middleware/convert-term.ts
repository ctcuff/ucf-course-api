import { Request, Response, NextFunction } from 'express'
import Scrapper from '../util/scraper'

// Converts the "term" query in any request to a term code that can
// be understood by UCF
const convertTerm = (req: Request, res: Response, next: NextFunction): void => {
  const term = req.query.term as string

  // Only do the conversion if the term isn't in the form 0000,
  // spring 2021 for example
  if (term && Number.isNaN(parseInt(term, 10))) {
    req.query.term = Scrapper.parseTerm(term)
  }

  next()
}

export default convertTerm
