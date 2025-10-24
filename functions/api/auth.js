export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return new Response('No code provided', { status: 400 });
  }
  
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: context.env.GITHUB_CLIENT_ID,
      client_secret: context.env.GITHUB_CLIENT_SECRET,
      code: code
    })
  });
  
  const data = await tokenResponse.json();
  if (!data.access_token && data.error) {
  return new Response(`<div>Error: ${data.error_description || data.error}</div>`, {
    headers: { 'Content-Type': 'text/html' }
  });
}

if (!context.env.GITHUB_CLIENT_ID || !context.env.GITHUB_CLIENT_SECRET) {
  return new Response('<div>MISSING CLIENT ENV VARS</div>', {
    headers: { 'Content-Type': 'text/html' }
  });
}
  const script = `
    <script>
      window.opener.postMessage({
        type: 'authorization-callback',
        data: ${JSON.stringify(data)}
      }, window.location.origin);
      window.close();
    </script>
  `;
  
  return new Response(script, {
    headers: { 'Content-Type': 'text/html' }
  });
}
