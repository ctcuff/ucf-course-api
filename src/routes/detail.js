import { Router } from 'express'
import Detail from '../controllers/detail'

const router = Router()

router.get('/:course', Detail.getCourse)
router.get('/:course/sections/:sectionId', Detail.getSection)

export default router
