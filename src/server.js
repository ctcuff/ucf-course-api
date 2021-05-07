import app from './app'
import logger from './util/logger'

const port = process.env.PORT || 3000

app.listen(port, () => logger.info(`listening at http://localhost:${port}`))
