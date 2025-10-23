export async function onRequestGet(context) {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authorizing...</title>
    </head>
    <body>
      <h1>Authorizing...</h1>
      <p>Please wait while we complete authentication.</p>
      <script>
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          window.location.href = '/api/auth?code=' + code;
        }
      </script>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}
