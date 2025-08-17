export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Try to serve the asset from the static assets
    const assetResponse = await env.ASSETS.fetch(request);
    
    // If the asset exists, return it
    if (assetResponse.status !== 404) {
      return assetResponse;
    }
    
    // For API routes, return 404 if not found
    if (url.pathname.startsWith('/api/')) {
      return new Response('Not Found', { status: 404 });
    }
    
    // For all other routes (SPA routing), serve index.html
    const indexRequest = new Request(
      new URL('/index.html', request.url).toString(),
      request
    );
    
    return env.ASSETS.fetch(indexRequest);
  }
};