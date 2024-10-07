export enum SystemHeaders {
  xRequestId = 'x-request-id',
}

export interface IRequestContext {
  [SystemHeaders.xRequestId]: string;
}
