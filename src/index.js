import express from 'express'
import logger from './util/logger'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send({ response: 'OK' }))

app.listen(port, () => logger.info(`Listening at http://localhost:${port}`))
