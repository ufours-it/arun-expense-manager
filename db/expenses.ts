import { openDB } from "./database";

export type Expense = {
   id: number;
   amount: number;
   category: string;
   date: string;
   note?: string;
};

export const addExpense = async (
   amount: number,
   category: string,
   date: string,
   note?: string
) => {
   const db = await openDB();

   const result = await db.runAsync(
      `INSERT INTO expenses (amount, category, date, note)
     VALUES (?, ?, ?, ?);`,
      [amount, category, date, note ?? ""]
   );

   return result;
};

export const getExpenses = async (): Promise<Expense[]> => {
   const db = await openDB();

   const rows = await db.getAllAsync<Expense>(
      "SELECT * FROM expenses ORDER BY id DESC "
   );
   
   return rows ?? [];
};


export const getExpensesRange = async (start: string, end: string): Promise<Expense[]> => {
   const db = await openDB();

   const rows = await db.getAllAsync<Expense>(
      `SELECT * FROM expenses WHERE date BETWEEN ? AND ? ORDER BY id DESC`,
      [start, end]
   );

   return rows ?? [];
}

export const getTotalExpenses = async (): Promise<number> => {
   const db = await openDB();

   const row = await db.getFirstAsync<{ total: number }>(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses;"
   );

   return row?.total ?? 0;
};

export const deleteExpense = async (id: number) => {
   const db = await openDB();

   const result = await db.runAsync(
      "DELETE FROM expenses WHERE id = ?;",
      [id]
   );

   return result;
};

export const updateExpense = async (
   id: number,
   amount: number,
   category: string,
   date: string,
   note?: string
) => {
   const db = await openDB();

   const result = await db.runAsync(
      `UPDATE expenses
     SET amount = ?, category = ?, date = ?, note = ?
     WHERE id = ?;`,
      [amount, category, date, note ?? "", id]
   );

   return result;
};