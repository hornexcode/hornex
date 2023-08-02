import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch('http://localhost:9234/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: req.body.email,
      password: req.body.password,
    }),
  });

  if (response.ok) {
    res.json(response.json());
  }
  res.status(401).json({ message: 'Unauthorized' });
}
