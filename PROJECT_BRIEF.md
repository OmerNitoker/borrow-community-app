# Project: Community Item Sharing App

## Product Goal
A full-stack app for borrowing and lending items inside private communities, where community member can add items that he is willing to share with others, search for items he needs and contact the owners.

## Core Rule
A user can view contact info in a community only if they have at least 3 active items in that same community.

## Main Entities
User, Community, Membership, Item, Category.

## Important Security Rule
Never return owner phone/contact info from the backend unless the current user is authorized.

## MVP features
- Auth
- Demo login
- Create community
- Join community with unique community code
- Membership approval by community admin.
- Community item catalog
- Item CRUD
- Contact access logic
- User profile (showing users items)
- Basic admin dashboard

## Tech Stack
frontend: React.js
backend: Node.js + express
database: MongoDB
auth: JWT / cookie

## Demo Requirement
Recruiters must be able to click "Enter Demo" and immediately see a populated demo community

