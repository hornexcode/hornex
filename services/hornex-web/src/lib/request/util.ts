import { get } from 'es-cookie';
import { NextResponse } from 'next/server';

// TODO: type this properly since the fetch is requiring an IncomingMessage
export const makeClientReqObj = (): any => {
  return { headers: { cookie: document.cookie } };
};

export const makeClientResObj = (): any => {
  return {};
};
