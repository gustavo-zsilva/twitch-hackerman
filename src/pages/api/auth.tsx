import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const { method, body } = req

    switch (method) {
        case 'POST':
            try {
                // Get User Auth Token
                const token = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${body.data.code}&grant_type=authorization_code&redirect_uri=${process.env.BASE_URL}`)

                // Get App Access Token
                const appToken = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`)

                res.status(201).json({ token: token.data, appToken: appToken.data })
            } catch (err) {
                res.status(400).json({ message: `Error ocurred on serverless function: ${err.message}` })
            }
            break
    }
}