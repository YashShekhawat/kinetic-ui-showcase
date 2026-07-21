export async function GET(): Promise<Response> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
        'Content-Type': 'application/json',
      },
    })

    const status = res.status
    const ok = res.ok
    const text = await res.text()

    return new Response(
      JSON.stringify({
        status: ok ? 'ok' : 'error',
        httpStatus: status,
        response: text,
        timestamp: new Date().toISOString(),
      }),
      {
        status: ok ? 200 : 502,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({
        status: 'error',
        message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
