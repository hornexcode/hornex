import { get } from 'es-cookie';

// TODO: type this properly since the fetch is requiring an IncomingMessage
export const makeClientReqObj = (): any => {
  return { headers: { cookie: document.cookie } };
};
