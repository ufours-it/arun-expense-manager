import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const openDB = async () => {
   if (!db) {
      db = SQLite.openDatabaseSync("expenses.db");
   }
   return db;
};

export const initDB = async () => {
   const db = await openDB();
   await db.execAsync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT
    );
  `);
};