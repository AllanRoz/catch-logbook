# Catch Logbook

You are an expert senior frontend engineer and UI/UX designer.

I want to build a polished web application called CatchLog.

This project will be hosted on GitHub Pages, so it must be a 100% static website with no backend, no database, and no authentication. Everything should run entirely in the browser.

Tech Stack

Use:

React

Vite

Tailwind CSS

JavaScript (not TypeScript)

React Router

Chart.js

LocalStorage for persistent data

Do NOT use:

Firebase

Supabase

Express

Node backend

Authentication

Any paid APIs

The application should be optimized for GitHub Pages.

Goal

Create a modern fishing journal where users can log every fishing trip, track catches, analyze trends, and visualize their fishing history.

The design should feel like a premium outdoor app with a clean, modern interface, smooth animations, responsive layouts, and excellent usability.

Core Features

Dashboard (Home)

Display summary cards showing:

Total fishing trips

Total fish caught

Biggest fish

Favorite species

Average fish length

Average fish weight

Include charts showing:

Fish caught by species

Monthly catches

Catch trends over time

Favorite fishing locations

Log a Fishing Trip

Create a form allowing users to record:

Trip Information

Date

Start time

End time

Location

GPS coordinates (optional)

Lake, river, pond, or ocean

Weather notes

Water clarity

Water temperature (optional)

Fishing Details

Species

Number caught

Length

Weight

Lure or bait used

Rod

Reel

Fishing technique

Released or kept

Trip Notes

Personal notes

Memorable moments

Lessons learned

Photos

Allow uploading multiple photos.

Store images locally in the browser where practical, and explain any browser storage limitations.

Trip History

Display all trips in cards.

Each card should show:

Date

Location

Species

Fish count

Largest fish

Thumbnail image

Allow users to:

Edit

Delete

Duplicate

View details

Trip Detail Page

Show:

Full trip information

Photo gallery

Notes

Complete catch list

Equipment used

Display summary statistics for the trip.

Search & Filters

Allow filtering by:

Species

Location

Date range

Lure

Technique

Water type

Released vs kept

Include instant search.

Statistics

Create a statistics page with charts showing:

Most successful lure

Most common species

Biggest fish by species

Average trip duration

Catch frequency

Fish caught each month

Best fishing season

Use Chart.js.

Personal Bests

Automatically track:

Largest fish ever

Longest fish

Heaviest fish

Most fish in one trip

Longest fishing trip

Display them on a dedicated page.

Data Storage

Use LocalStorage.

Create utility functions for:

Save

Load

Update

Delete

Export data as JSON

Import data from JSON

The user should never lose their data when refreshing the page.

UI Design

Use Tailwind CSS.

Create:

Dark mode

Mobile responsive layout

Rounded cards

Modern dashboard

Floating action button for adding trips

Smooth hover animations

Sticky navigation

Clean typography

Outdoor-inspired color palette

Project Structure

Organize the project professionally.

Example folders:

src/
components/
pages/
hooks/
utils/
data/
assets/
context/
styles/

Keep components reusable and avoid large files.

Code Quality

Write production-quality React code.

Use:

Functional components

React hooks

Reusable UI components

Clear comments where helpful

Consistent naming

Modular architecture

Explain important architectural decisions.

Performance

Optimize for GitHub Pages.

Keep everything static.

Lazy-load images where appropriate.

Avoid unnecessary re-renders.

Keep the bundle size small.

Development Process

Do NOT generate the entire application in one response.

Build the application one milestone at a time.

Start with:

Creating the Vite project

Installing dependencies

Tailwind CSS setup

Folder structure

Routing

Navigation

Dashboard layout

After completing each milestone, stop and wait for my approval before moving on.

Whenever possible, explain why you're making architectural decisions so I learn while building.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0a3d7e54-b8cc-432e-8227-362540839d8b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
