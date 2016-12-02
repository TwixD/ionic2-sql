import {Injectable} from "@angular/core";
import {Sql} from "./sql";

@Injectable()
export class DatabaseService {

  private shopping_list = "shopping_list";
  private initDb: Promise<any>;

  constructor(public _db: Sql) {
    this.initDb = _db.init();
  }

  //
  // shopping_list queries
  //
  addShoppingItem(item: string, quantity: number): Promise<boolean> {
    let insertQuery: string = `INSERT OR REPLACE INTO ${this.shopping_list} (item, quantity) VALUES (?, ?)`;
    let createTableQuery: string = `CREATE TABLE IF NOT EXISTS ${this.shopping_list} (item TEXT PRIMARY KEY, quantity INTEGER)`;
    let self = this;
    return this.initDb
      .then(() => self._db.query(createTableQuery))
      .then(() => self._db.query(insertQuery, [item, quantity]))
      .then(data => {
        console.debug(item + " > Inserted with id -> " + data.res.insertId);
        return true;
      })
      .catch(error => {
        console.error("Saving item error -> " + error.err.message);
        return false;
      });
  }

  getShoppingItem(item: string): Promise<{item: string, quantity: number}> {
    let getQuery: string = `SELECT item, quantity FROM ${this.shopping_list} WHERE item = ?`;
    return this.initDb
      .then(() => this._db.query(getQuery, [item]))
      .then(data => {
        if (data.res.rows.length > 0) {
          let obj: any = data.res.rows.item(0);
          return {
            item: obj.item,
            quantity: obj.quantity
          };
        }
        return null;
      }).catch(error => {
        console.error("Getting item error -> " + error.err.message);
        return null;
      });
  }

  removeShoppingItem(item: string): Promise<boolean> {
    let query: string = `DELETE FROM ${this.shopping_list} WHERE item = ?`;
    let self = this;
    return this.initDb
      .then(() => self._db.query(query, [item]))
      .then(() => true)
      .catch(error => {
        console.error("Removing item error -> " + error.err.message);
        return false;
      });
  }

  //
  // Getter Setter
  //
  set(key: string, value: string): Promise<boolean> {
    return this.initDb
      .then(() => this._db.set(key, value))
      .then(() => true)
      .catch(err => {
        console.error('[Error] Saving ' + key + ' - ' + JSON.stringify(err));
        return false;
      });
  }

  get(key: string): Promise<string> {
    return this.initDb
      .then(() => this._db.get(key))
      .then(value => {
        if (value) {
          return value;
        } else {
          throw new Error('Undefined value');
        }
      })
      .catch(err => {
        console.error('[Error] Getting ' + key + ' - ' + JSON.stringify(err));
        return null;
      });
  }

  remove(key: string): Promise<boolean> {
    return this.initDb
      .then(() => this._db.remove(key))
      .then(() => true)
      .catch(err => {
        console.error('[Error] Removing ' + key + ' - ' + JSON.stringify(err));
        return false;
      });
  }

  getJson(key: string): Promise<any> {
    return this.get(key).then(value => {
      try {
        return JSON.parse(value);
      } catch (err) {
        console.error('Storage getJson(): unable to parse value for key', key, ' as JSON');
        throw null;
      }
    });
  }

  setJson(key: string, value: any): Promise<boolean> {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (err) {
      return Promise.reject(false);
    }
  }
}
