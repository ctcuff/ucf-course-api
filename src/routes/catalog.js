import { Router } from 'express'
import Catalog from '../controllers/catalog'

const router = Router()

router.get('/', Catalog.getAll)
router.get('/:area', Catalog.getArea)

export default router
