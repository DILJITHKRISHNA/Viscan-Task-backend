import express from 'express'
const router = express.Router()
import { AddUser, GetAllUser, LoginUser } from '../Controller/UserController.js'

router.post('/createuser', AddUser)
router.post('/loginuser', LoginUser)
router.get('/allusers', GetAllUser)

export default router