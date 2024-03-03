import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private _setting = 'setting';
  private _user = 'user';

  schema = {
    stores: [
      {
        name: this._setting,
        columns: [
          {
            name: 'key',
            isPrimaryKey: true,
            type: 'TEXT',
          },
          {
            name: 'value',
            type: 'TEXT',
          },
        ],
      },
      {
        name: this._user,
        columns: [
          {
            name: 'mobile',
            isPrimaryKey: true,
            type: 'TEXT',
          },
          {
            name: 'name',
            type: 'TEXT',
          },
          {
            name: 'email',
            type: 'TEXT',
          },
        ],
      },
    ],
  };
  tables = {
    setting: this._setting,
    user: this._user,
  };

  constructor() {}
}

export interface ITableOptions {
  name: string;
  columns: Array<{ name; isPrimaryKey?; type? }>;
  autoIncrement?: boolean;
}
