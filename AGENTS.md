# AGENTS.md

## Project Context
This is a fuul-stack community item-sharing app.

Users can create or join private communities and lend/borrow items inside them.

## Core Business Rule
A user may view owner contact info only if:
1. The user is authenticated
2. The user is an approved member of the item's community
3. The user has at least 3 active items in that same community.

Never expose any contact info (including name and phone number) from the backend unless this rule passes.

## Development Style
- Build incrementally.
- Do not implement large unrelated chunks in one task.
- Prefer clean, simple and readable code.
- Add comments only where they clarify business logic.
- Keep backend authorization checks server-side.
- Do not trust frontend state for permissions

## Tech Stack
- Backend: Node.js, Express, MongoDB
- Frontend: React.js
- Auth: JWT / cookie auth

## Stack Rules
- Do not use Typescript in this project. use only Javascript.

## MVP Scope
Implement only:
- Auth
- Demo login
- Communities
- Memberships
- Items
- Contact access logic
- User profile
- Basic admin tools

## Do not implement yet:
- Chat
- Payments
- Ratings
- Calender or Lending time
- Push notifications
- Login with google account