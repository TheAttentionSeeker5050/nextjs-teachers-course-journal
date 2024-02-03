// use bcrypt to hash the password and compare the password

import bcrypt from 'bcrypt';


// hash the password with salt
export async function hashPassword(password, saltRounds = 10) {
    return await bcrypt.hash(password, saltRounds);
}


// compare the password using salt, it will return 
// true if the password is correct 
// and false if the password is incorrect
export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}