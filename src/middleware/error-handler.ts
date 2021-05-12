import { Request, Response, NextFunction } from 'express'
import ExpressError from '../util/express-error'
import logger from '../util/logger'

// Allows the API to convert any thrown ExpressError into a JSON
// response with the status set to the status of that error
const errorHandler = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.message)
  res.status(err.status).send({ error: err.message })

  next()
}

export default errorHandler
