import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
const middleware = (request: NextRequest) => {
  //   return NextResponse.json(request);
};

export { middleware };
