import express from 'express'
const router = express.Router()
import { AddToFav, AddUser, DeleteUserFav, GetAllUser, GetCityDailyForcast, GetCityWeather, GetFavorites, LoginUser } from '../Controller/UserController.js'

router.post('/register', AddUser)
router.post('/login', LoginUser)
router.get('/allusers', GetAllUser)
router.get('/weather/current/:city', GetCityWeather)
router.get('/weather/forecast/:city', GetCityDailyForcast)
router.post('/favorites/:name/:temp/:desc/:humidity', AddToFav)
router.get('/favorites', GetFavorites)
router.get('/delete/:id', DeleteUserFav)
// router.get('/weather/historical/:city', GetPastForecast)

export default router