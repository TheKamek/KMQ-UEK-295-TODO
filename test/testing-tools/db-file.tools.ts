import * as path from 'path';
import * as fs from 'fs';

export class DbFileTools {
  static resetTestDatabase(tableName: string) {
    const dbName = `test/database/test-${tableName}.db`;
    try {
      const fileName = path.join(__dirname, dbName);
      if (fs.existsSync(fileName)) {
        // try to delete it
        console.log('delete file', fileName);
        fs.rmSync(fileName);
      }
    } catch (err) {
      console.error(err.message);
    }
    return dbName;
  }
}
