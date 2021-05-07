import express from 'express'

const app = express()

app.get('/', (req, res) => res.send({ response: 'OK' }))

export default app
