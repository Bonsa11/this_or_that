import sqlite3 from "sqlite3";

async function createUserTable(db: sqlite3.Database) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    `);
}

async function createUserHistoryTable(db: sqlite3.Database) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS user_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            question_id INTEGER,
            answer_id INTEGER,
        )
    `);
}

async function createQuestionsTable(db: sqlite3.Database) {
    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            premise TEXT,
            answerArray TEXT NOT NULL,
        )
    `);
}

async function createAnswersTable(db: sqlite3.Database) {
    db.run(`
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
        )
    `);
}

async function runSetup(db: sqlite3.Database) {
    await createUserTable(db)
    await createUserHistoryTable(db)
    await createQuestionsTable(db)
    await createAnswersTable(db)
}

export {runSetup}