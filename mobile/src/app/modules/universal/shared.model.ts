export interface IDataSourceResult<T> {
  extraData: any;
  data: T[];
  errors: any;
  total: number;
}

export enum RecordStatus {
  Published = 1,
  UnPublished = 2,
  Deleted = 3,
}
