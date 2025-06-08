import { config } from "dotenv";
import path from "path";

config({
    path: path.resolve(
        process.cwd(),
        `.env.${process.env.NODE_ENV || 'development'}.local`
    )
});

const ENV = {
    PORT: Number(process.env.PORT) || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    STATE_SECRET: process.env.STATE_SECRET || 'secret',
    REDIRECT_URI: process.env.REDIRECT_URI,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET
};

export default ENV;
