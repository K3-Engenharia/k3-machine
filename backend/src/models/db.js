import Database from 'better-sqlite3';
let dbInstance;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new Database('./k3machine.sqlite');
  }
  return dbInstance;
}
