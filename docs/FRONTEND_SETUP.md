# Frontend Setup & Backend Connection (Rails)

This document describes how to connect the Next.js frontend to the Rails backend maintained by the backend team.

1) Environment
- Set `NEXT_PUBLIC_API_URL` to the root URL of the Rails API, e.g. `http://localhost:3000` or `https://api.example.com`.

2) CORS and Cookies
- Rails must allow CORS and credentials for session cookies. Example (use on the Rails app):

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000' # frontend origin(s)
    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end
end
```

3) CSRF & Authentication
- For cookie-based sessions and Rails CSRF protection, include credentials in requests (`withCredentials: true`).
- If the backend provides token-based auth, store tokens securely (httpOnly cookies or secure storage) and send `Authorization` headers.

4) API conventions used in this frontend
- This frontend expects JSON APIs under `/api/v1/...`. Adjust `AuthService` endpoints in `src/services/auth.ts` if your API namespace differs.

5) Typical endpoints to coordinate with backend team
- `POST /api/v1/sessions` => login
- `DELETE /api/v1/logout` => logout
- `GET /api/v1/current_user` => current user

6) Developer steps
- Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.
- Install dependencies: `npm install` or `yarn`.
- Start dev server: `npm run dev`.

7) Notes for backend team
- Allow `Access-Control-Allow-Credentials: true` and return JSON responses.
- If using namespaced routes, share the exact paths so frontend service endpoints can be aligned.
