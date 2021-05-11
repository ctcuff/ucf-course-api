import { Request, Response, NextFunction } from 'express'
import logger from './logger'

class ExpressError extends Error {
  public readonly status: number

  constructor({ message, status }: ExpressErrorOpts) {
    super(message)
    this.status = status
  }
}

const errorHandler = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.stack)
  res.status(err.status).send({ error: err.message })

  next()
}

type ExpressErrorOpts = {
  message: string
  status: number
}

export { ExpressError as default, errorHandler }
