import prisma from '../db/Prisma.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()
import bcrypt from 'bcrypt'


export const AddUser = async (req, res) => {
    const { name, email, password } = req.body
    console.log(req.body);
    try {
        if (name && email && password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: hashedPassword
                },  
            });
            console.log('Created new user:', newUser);
            const token = await jwt.sign({ _id: newUser.id }, process.env.TOKEN_KEY, { expiresIn: '24h' })
            res.cookie("usertoken", token, {
                httpOnly: false,
                withCredentials: true
            })
            console.log(token);
            res.status(200).json({ success: true, message: 'User created successfully', newUser, token })
        } else {
            console.log("Missing credentials!");
            res.status(400).json({ message: 'missing credentials!' })
        }
    } catch (error) {
        console.log(error);
    }
}

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email: email } })
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = await jwt.sign({ _id: user.id }, process.env.TOKEN_KEY, { expiresIn: '24h' })
                res.status(200).json({ success: true, message: "User logged In!", token, user })
            } else {
                res.json({ success: false, message: "Invalid Credentials" })
            }
        } else {
            res.json({ success: false, message: "User Not Exist!" })
        }

    } catch (error) {
        console.log(error);
    }
}

export const GetAllUser = async (req, res) => {
    try {
        const AllUsers = await prisma.user.find()
        console.log(AllUsers, "allusersss");
    } catch (error) {
        console.log(error);
    }
}