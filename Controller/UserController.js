import prisma from '../db/Prisma.js'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import env from 'dotenv'
env.config()
import bcrypt from 'bcrypt'


export const AddUser = async (req, res) => {
    const { name, email, password } = req.body
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
            const token = await jwt.sign({ _id: newUser.id }, process.env.TOKEN_KEY, { expiresIn: '24h' })
            res.cookie("usertoken", token, {
                httpOnly: false,
                withCredentials: true
            })
            res.status(200).json({ success: true, message: 'User created successfully', newUser, token })
        } else {
            console.log("Missing credentials!");
            res.json({ message: 'missing credentials!' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email: email } });
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
        res.status(500).json({ error: error.message });
    }
}

export const GetAllUser = async (req, res) => {
    try {
        const AllUsers = await prisma.user.find()
        console.log(AllUsers, "allusersss");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const GetCityWeather = async (req, res) => {
    try {
        const { city } = req.params
        if (city) {
            const response = await fetch(`${process.env.BASE_URL}?q=${city}&appid=${process.env.API_KEY}&units=metric`);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            res.json({ success: true, message: "response sent to frontend", data });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const GetCityDailyForcast = async (req, res) => {
    try {
        const { city } = req.params
        const days = 7
        if (city) {
            const response = await fetch(`${process.env.FORCAST_BASE_URL}?q=${city}&appid=${process.env.API_KEY}&cnt=${days}&units=metric`);
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            const data = await response.json();
            res.json({ success: true, message: "response sent to frontend", data });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const AddToFav = async (req, res) => {
    try {
        const { name, temp, desc, humidity } = req.params;
        console.log(name, temp, desc, humidity, "Request params");

        if (!name || !temp || !desc || !humidity) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const favsExist = await prisma.wishlist.findUnique({ where: { place: name } });
        if (!favsExist) {
            const NewFavCity = await prisma.wishlist.create({
                data: {
                    place: name,
                    temperature: temp,
                    description: desc,
                    humidity: humidity
                },
            });
            return res.json({ success: true, message: "City added to wishlist", NewFavCity });
        } else {
            return res.json({ success: false, message: "City already exists in wishlist" });
        }
    } catch (error) {
        console.log(error.message);
    }
}
export const GetFavorites = async (req, res) => {
    try {
        const favs = await prisma.wishlist.findMany();
        if (favs) {
            res.json({ success: true, message: "Fav cities fetched", favs })
        } else {
            res.json({ success: false, message: "No fav cities found" })
        }
    } catch (error) {
        console.log(error.message);
    }
}
export const DeleteUserFav = async (req, res) => {
    console.log("deletefav");
    try {
        const { id } = req.params
        const deleteFav = await prisma.wishlist.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true, message: 'City deleted from wishlist', deleteFav });
    } catch (error) {
        console.log(error.message);
    }
}

// export const GetPastForecast = async (req, res) => {
//     const { city } = req.params;
//     try {
//         // Fetching geographical coordinates of the city
//         const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.API_KEY}`);
//         const geoData = geoResponse.data;

//         if (geoData.length === 0) {
//             return res.status(404).send('City not found');
//         }

//         const start = new Date();
//         const end = new Date();
//         start.setDate(end.getDate() - 7);

//         const startDate = start.toISOString().split('T')[0];
//         const endDate = end.toISOString().split('T')[0];

//         const weatherUrl = `http://api.weatherstack.com/historical?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${city}&historical_date_start=${startDate}&historical_date_end=${endDate}&hourly=1`;

//         const weatherResponse = await axios.get(weatherUrl);
//         console.log(weatherResponse,"weaether response data");

//         if (weatherResponse.data.error) {
//             return res.status(400).send(weatherResponse.data.error.info);
//         }
//         // res.json(weatherResponse.data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// };
