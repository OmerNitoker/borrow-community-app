# QA Checklist

Use this checklist before sharing the app with a recruiter or tester.

## Local Setup

- MongoDB is running locally.
- Backend env values exist in `backend/.env`.
- Cloudinary upload works with a small image.
- Backend business-rule tests pass with `npm run test:backend`.
- Backend is running with `npm run dev:backend`.
- Frontend is running with `npm run dev:frontend`.
- App opens at `http://localhost:5173`.

## Demo Flow

- Click `כניסה לדמו`.
- User lands inside `קהילת הדמו`.
- Demo badge is visible in the app header.
- Demo community shows seeded items.
- Seeded demo items cannot be edited or hidden.
- Admin dashboard marks seeded demo items as protected.
- `npm run reset:demo` restores the demo community and seeded demo items.

## Auth

- New user can register with name, email, password, and phone.
- Existing user can log in.
- Logged-in user can log out.
- Unauthenticated user cannot access protected app pages.

## Communities

- User with no communities lands on onboarding.
- User can create a community.
- Community creator becomes approved admin.
- User can join a community by code.
- If approval is required, join request becomes pending.
- Pending user lands on the pending approval page.
- Pending user can cancel the request.
- Community admin can approve/reject pending members.

## Items

- Approved member can add an item.
- Item can be created without images.
- Item can be created with up to 3 images.
- Uploaded images appear in catalog, details, profile, and admin dashboard.
- Edit page shows existing images.
- Owner can delete an uploaded image.
- Owner can edit item details.
- Owner can hide their own item.
- Owner can reactivate an owner-hidden item.
- Owner cannot reactivate an admin-hidden item.
- Community admin can hide another user's active item.

## Contact Access

- Owner viewing own item does not see their own contact details.
- Non-owner with fewer than 3 active items does not receive contact details.
- Locked contact section shows blurred placeholder only.
- Non-owner with at least 3 active items in the same community receives contact details.
- Community admin receives contact details regardless of their own active item count.
- Backend responses never expose real phone/name contact details when access is denied.

## Profile

- Profile is private and shows only the current user's data.
- Profile shows user communities.
- Profile shows active item count per community.
- Profile shows active and inactive user items.
- Admin-hidden items are clearly labeled.

## Admin Dashboard

- Only community admins can access the dashboard.
- Dashboard shows pending members.
- Dashboard shows approved members.
- Dashboard shows all community items, active and inactive.
- Dashboard shows item status clearly.
- Dashboard does not allow hiding protected seeded demo items.
