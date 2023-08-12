export type SetParams = (
  db: Map<string, string>,
  expiryStore: Map<string, Date>,
  key: string,
  value: any,
  duration: string
) => string;

export type GetParams = (
  db: Map<string, string>,
  expiryStore: Map<string, Date>,
  key: string
) => any;

export type DeleteParams = (db: Map<string, string>, key: string) => string;
