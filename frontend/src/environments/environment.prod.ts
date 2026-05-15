export const environment = {
  production: true,
  // Relative URL: nginx (or any reverse-proxy) forwards /api/ to the backend.
  // Works both in the Docker setup and when deployed behind a real reverse-proxy.
  apiBaseUrl: '/api/v1',
};
