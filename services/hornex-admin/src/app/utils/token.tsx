export type Token = {
  access: string
  refresh: string
}

export async function getToken() {
  const res = await fetch('http://localhost:8000/api/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@hornex.gg',
      password: 'admin',
    }),
  })

  const token: Token = await res.json()

  return token
}