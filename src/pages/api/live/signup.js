import { hashPassword } from "@/utils/validation/passwordEncryption";
import { createUser } from "@/data/dbTransactions/user.dbTransaction";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password, firstName, lastName, title, organization } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(password);

    try {
        // Create the user in the database
        const newUser = await createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            title,
            organization
        });

        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
