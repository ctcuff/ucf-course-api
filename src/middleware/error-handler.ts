import { Request, Response, NextFunction } from 'express'
import ExpressError from '../util/express-error'
import logger from '../util/logger'

const errorHandler = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.stack as string)
  res.status(err.status).send({ error: err.message })

  next()
}

export default errorHandler
