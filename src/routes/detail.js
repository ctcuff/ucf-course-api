import { Router } from 'express'
import Detail from '../controllers/detail'

const router = Router()

router.get('/:course', Detail.getCourse)

export default router
