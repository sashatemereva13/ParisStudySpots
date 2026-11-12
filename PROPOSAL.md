# Project proposal

* Name: Sasha
* Project title: Study Spots Paris
* Pitch (one sentence): A student-made guide to the places in Paris where you can actually study (libraries, cafés, coworking spaces), rated by students on Wi-Fi, outlets, noise and price, with a live "how busy is it right now" signal.
* Target users: Students in Paris looking for somewhere to work outside home or campus, especially those new to the city.

## Pages

| URL | Content | Dynamic segment? | Rendering strategy and why |
|---|---|---|---|
| / | Pitch, how it works, featured spots, links to areas, search and "suggest a spot" | No | SSG (○). Same for everyone and changes almost never, so it is prerendered once at build time and loads instantly. |
| /spots | List of all spots with their type, area and average ratings | No | ISR (`revalidate = 60`). Public and must be indexed, and changes a few times a day when spots or reviews are added. Visitors get the cached page instantly, and new data appears within a minute without rebuilding. |
| /areas/[slug] | All spots in one area of Paris (for example `/areas/5e-arrondissement`), sorted by average rating | Yes, `[slug]` | ISR (`revalidate = 60`) with `generateStaticParams`. These are the pages people find from searches such as "where to study in the 5e", so the content must be in the HTML. The list of areas is known and fixed, so every area page is prebuilt. |
| /spots/[slug] | One spot: address, opening hours, average ratings, reviews with a form to add one, and the live "busy right now" indicator | Yes, `[slug]` | ISR (`revalidate = 60`) with `generateStaticParams`. A spot page is shared with friends, so the content and the `og:` tags (from `generateMetadata`) must be in the HTML for link previews. Known spots are prebuilt, and spots added later are generated on demand. The "busy right now" indicator is a Client Component fetched in the browser, because it changes every few minutes while the rest of the page stays static. |
| /search?q=... | Spots whose name or address matches the query, with optional filters (type, quiet, outlets) | No (query string) | SSR (`ƒ`). The result depends on the query, so it cannot be prerendered. Reading `searchParams` makes the route dynamic. |
| /spots/new | Form to suggest a new spot | No | SSG (○) page containing a Client Component form that posts to `POST /api/spots`. No data to fetch on the server. |

## Data

Entities (2 to 4), their main fields, and how they are related:

**Area**: a part of Paris
* `id`, `slug` (unique, used in the URL), `name` (for example "5e arrondissement")

**Spot**: a place to study
* `id`, `slug` (unique), `name`, `areaId` (foreign key to Area)
* `type`: library, café, coworking or other
* `address`, `openingHours` (text), `coffeePrice` (optional)
* `createdAt`

**Review**: a student's rating of a spot
* `id`, `spotId` (foreign key to Spot)
* `nickname` (no account needed)
* `wifi`, `outlets`, `noise`, `comfort`: ratings from 1 to 5
* `comment`
* `editToken` (secret, never sent back in public responses: see below)
* `createdAt`, `updatedAt`

**CheckIn**: a quick "I'm here now" signal
* `id`, `spotId` (foreign key to Spot)
* `crowd`: quiet, busy or full
* `createdAt`

Relations:
* One Area has many Spots. A Spot belongs to one Area.
* One Spot has many Reviews and many CheckIns. Deleting a Spot deletes its Reviews and CheckIns (cascade).

The averages are computed from the Reviews, not stored. The "busy right now" indicator only counts CheckIns from the last 2 hours.

The database starts with the areas of Paris and 8 to 10 seed spots (for example, well-known libraries such as the BnF and the Bibliothèque Sainte-Geneviève, and a few cafés I tested), with sample reviews.

## Write actions

What users can create, update or delete:

* **Create a Spot**: suggest a new place (`POST /api/spots`).
* **Create a Review**: rate a spot and leave a comment (`POST /api/spots/[slug]/reviews`).
* **Update a Review**: edit your own review (`PATCH /api/reviews/[id]`).
* **Delete a Review**: remove your own review (`DELETE /api/reviews/[id]`).
* **Create a CheckIn**: one tap on a spot page to say how busy it is right now (`POST /api/spots/[slug]/checkins`).

Since there is no login, creating a review returns a secret edit token that the browser keeps in `localStorage`. Editing or deleting a review requires that token, so visitors can only change their own reviews.

Read routes used by the front end:
* `GET /api/spots/[slug]/reviews`: reviews of a spot
* `GET /api/spots/[slug]/crowd`: the current "busy right now" level, polled by the browser

## Repository

GitHub URL:
