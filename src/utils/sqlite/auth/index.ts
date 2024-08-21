import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';



// Register a new user
async function registerUser(db: sqlite3.Database, username: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10); // Hash the password
    await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
}

// Authenticate a user
async function authenticateUser(db: sqlite3.Database, username: string, password: string) {
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (user && await bcrypt.compare(password, user.password_hash)) {
        return true; // Authentication successful
    }
    return false; // Authentication failed
}

export {registerUser, authenticateUser}
