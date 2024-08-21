import sqlite3 from 'sqlite3';
import * as fs from 'fs'
import { open } from 'sqlite';
import { runSetup } from './setup';

const SQLITE_DB_FILEPATH = './questions.db'

// Open a database connection
async function openDb() {
    return open({
        filename: SQLITE_DB_FILEPATH,
        driver: sqlite3.Database
    });
}

// Main function
async function main() {

    // check if db exists
    if (!fs.existsSync(SQLITE_DB_FILEPATH)){
        const db = await openDb();
        await runSetup(db)
        await db.close();
    }

    
}

main().catch(console.error);
