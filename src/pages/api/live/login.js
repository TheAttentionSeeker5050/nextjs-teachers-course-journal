import { serialize } from "cookie";
import { hashPassword, comparePassword } from "@/utils/validation/passwordEncryption";
import { createAccessToken, createRefreshToken } from "@/utils/validation/jwt";
import { getUserByEmail } from "@/data/dbTransactions/user.dbTransaction";
import { cookieConfig } from "@/utils/validation/cookies";


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    // Retrieve user from the database based on the email
    const user = await getUserByEmail(email);

    // Check if the user exists and the password matches
    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create access and refresh tokens
    const accessToken = createAccessToken({ userId: user.id, email: user.email });
    const refreshToken = createRefreshToken({ userId: user.id, email: user.email });

    // make an array of the serialized cookies
    const newCookie = [
        serialize("accessToken", accessToken, cookieConfig),
        serialize("refreshToken", refreshToken, cookieConfig),
        // serialize("foo", "bar", cookieConfig)
    ]

    res.setHeader("Set-Cookie", newCookie)

    res.status(200).json({ user });
}
