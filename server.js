import express from 'express'
const app = express()
import cors from 'cors'
import env from 'dotenv'
env.config()
import UserRoutes from './Routes/UserRoutes.js'

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', UserRoutes)

app.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}!`)
})