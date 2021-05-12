import { Request, Response, NextFunction } from 'express'
import Scraper from '../util/scraper'

// Converts the "term" query in any request to a term code that can
// be understood by UCF
const convertTerm = (req: Request, res: Response, next: NextFunction): void => {
  const term = req.query.term as string

  // Only do the conversion if the term isn't in the form 0000,
  // for example: "?term=summer2021" gets converted to "?term=1720"
  if (term && Number.isNaN(parseInt(term, 10))) {
    // Assigning the term to undefined here will allow the scraper
    // to remove the query when the URL is being built
    req.query.term = Scraper.parseTerm(term) || undefined
  }

  next()
}

export default convertTerm
