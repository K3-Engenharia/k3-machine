import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDb() {
  return open({
    filename: './k3machine.sqlite',
    driver: sqlite3.Database
  });
}
