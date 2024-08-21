import sqlite3 from "sqlite3";

// Insert a new question
async function insertQuestion(db: sqlite3.Database, premise: string, answerArray: string) {
    await db.run(`
        INSERT INTO questions (premise, answerArray)
        VALUES (?, ?)
    `, [premise, answerArray]);
}

// Insert a new answer
async function insertAnswer(db: sqlite3.Database, name: string) {
    await db.run(`
        INSERT INTO answers (name)
        VALUES (?)
    `, [name]);
}

export {insertQuestion, insertAnswer}