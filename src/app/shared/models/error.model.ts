export interface Error {
  code: string;
  description: string;
  subErrors: Error[];
}
