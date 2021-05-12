import express, { Response, Request, NextFunction } from 'express'
import cors from 'cors'
import catalogRouter from './routes/catalog'
import detailRouter from './routes/detail'
import errorHandler from './middleware/error-handler'
import convertTerm from './middleware/convert-term'
import ExpressError from './util/express-error'

const app = express()

app.use(cors())
app.use(convertTerm)

app.use('/catalog', catalogRouter)
app.use('/detail', detailRouter)

// Catch any routes that haven't been defined
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    new ExpressError({
      message: 'Invalid route',
      status: 404
    })
  )
})

app.use(errorHandler)

export default app
