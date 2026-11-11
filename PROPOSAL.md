# Project proposal

* Name: Sasha
* Project title: Study Spots Paris
* Pitch (one sentence): A student-made guide to the places in Paris where you can actually study (libraries, cafés, coworking spaces), rated by students on Wi-Fi, outlets, noise and price.
* Target users: Students in Paris looking for somewhere to work outside home or campus, especially those new to the city.

## Pages

| URL | Content | Dynamic segment? | Rendering strategy and why |
|---|---|---|---|
| / | Pitch, a few featured spots, links to the list and to "suggest a spot" | No | Static (○). The content rarely changes, so it is prerendered once at build time and loads instantly. |
| /spots | List of all spots with their type, arrondissement and average ratings, with filters (type, arrondissement, quiet, outlets) | No | ISR (`revalidate = 60`). Public page that must be indexed and fast. A new spot appears within a minute without rebuilding. Filtering is done in the browser on the already loaded list, so the page stays static. |
| /spots/[slug] | One spot: address, opening hours, average ratings, and the list of reviews with a form to add one | Yes, `[slug]` | SSG with `generateStaticParams` + ISR (`revalidate = 60`). The spot information is prerendered for SEO (searches such as "study café near Trocadéro"). The reviews section is a Client Component that reads and writes through the API routes, so a new review shows up immediately with loading and error states. |
| /spots/new | Form to suggest a new spot | No | Static page with a Client Component form that posts to `POST /api/spots`. No data to fetch on the server. |
| /about | What the project is, how ratings work, and that the seed data is sample data | No | Static (○). |

## Data

Entities (2 to 4), their main fields, and how they are related:

**Spot**
* `id`, `slug` (unique, used in the URL), `name`
* `type`: library, café, coworking or other
* `address`, `arrondissement`
* `openingHours` (text), `coffeePrice` (optional)
* `createdAt`

**Review**
* `id`, `spotId` (foreign key to Spot)
* `nickname` (no account needed)
* `wifi`, `outlets`, `noise`, `comfort`: ratings from 1 to 5
* `comment`
* `editToken` (secret, never sent back in public responses: see below)
* `createdAt`, `updatedAt`

Relation: one Spot has many Reviews (one-to-many). A Review belongs to exactly one Spot. Deleting a Spot deletes its Reviews (cascade).

The averages shown on `/spots` and `/spots/[slug]` are computed from the Reviews, not stored.

The database starts with 8 to 10 seed spots (for example, well-known libraries such as the BnF and the Bibliothèque Sainte-Geneviève, and a few cafés I tested), with sample reviews.

## Write actions

What users can create, update or delete:

* **Create a Spot**: suggest a new place (`POST /api/spots`).
* **Create a Review**: rate a spot and leave a comment (`POST /api/spots/[slug]/reviews`).
* **Update a Review**: edit your own review (`PATCH /api/reviews/[id]`).
* **Delete a Review**: remove your own review (`DELETE /api/reviews/[id]`).

Since there is no login, creating a review returns a secret edit token that the browser keeps in `localStorage`. Editing or deleting a review requires that token, so visitors can only change their own reviews.

Read routes used by the front end: `GET /api/spots` and `GET /api/spots/[slug]/reviews`.

## Repository

GitHub URL:
