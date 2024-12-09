export interface ErrorInterface {
  code: string;
  description: string;
  subErrors: ErrorInterface[];
}
