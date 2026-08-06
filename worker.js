export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      return handleAuth(url, env);
    }
    if (url.pathname === "/callback") {
      return handleCallback(url, env);
    }

    return env.ASSETS.fetch(request);
  },
};

function handleAuth(url, env) {
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("redirect_uri", `${url.origin}/callback`);
  return Response.redirect(authorizeUrl.toString(), 302);
}

async function handleCallback(url, env) {
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Eksik yetkilendirme kodu.", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    return new Response(
      `GitHub yetkilendirme hatası: ${tokenData.error_description || tokenData.error || "bilinmeyen hata"}`,
      { status: 400 }
    );
  }

  const content = { token: tokenData.access_token, provider: "github" };
  const message = `authorization:github:success:${JSON.stringify(content)}`;

  const script = `
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  `;

  return new Response(`<!DOCTYPE html><html><body><script>${script}</script></body></html>`, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
