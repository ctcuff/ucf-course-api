import logger from './logger'

class ExpressError extends Error {
  /**
   * @typedef {Object} ErrorOptions
   * @property {string} message
   * @property {number} status
   *
   * @param {ErrorOptions} opts
   */
  constructor({ message, status }) {
    super(message)
    this.status = status
  }
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack)
  res.status(err.status).json({ error: err.message })

  next()
}

export { ExpressError as default, errorHandler }
