import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body } = req

    switch (method) {
        case 'POST':
            try {
                const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${body.data.code}&grant_type=authorization_code&redirect_uri=${process.env.BASE_URL}`)
                console.log('TOKEN RECEIVED FROM SERVER: ', response.data)
                res.status(201).json(response.data)
            } catch (err) {
                res.status(400).json({ error: err.message })
            }
            break
    }
}