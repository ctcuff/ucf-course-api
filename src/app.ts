import express from 'express'
import cors from 'cors'
import catalogRouter from './routes/catalog'
import detailRouter from './routes/detail'
import errorHandler from './middleware/error-handler'
import convertTerm from './middleware/convert-term'

const app = express()

app.use(cors())
app.use(convertTerm)
app.use('/catalog', catalogRouter)
app.use('/detail', detailRouter)
app.use(errorHandler)

export default app
