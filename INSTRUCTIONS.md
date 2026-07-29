# Skills Assessment - Transactions Dashboard

This is a small full-stack TypeScript project: an Express API that serves
payment transactions, and a React + Vite dashboard that displays them.

We're not looking for perfection or for you to finish everything. We're much
more interested in **how you think** - how you read an unfamiliar codebase, how
you weigh trade-offs, and how you communicate. Please jot notes as you go; the
notes matter as much as the code.

**Suggested time: ~2 hours.** There is deliberately more here than most people
finish in that time - don't stress! For anything you don't get to (or anything
half-implemented) a note on how you'd approach it is just as valuable as code.

## Getting set up

```bash
npm install
npm run dev
```

- Web app: http://localhost:3000
- API: http://localhost:4000

Use any editor, tools, or references you normally would.

## What we'd like you to do

### Task 1 - Add pagination and search (frontend + backend)

Right now the API returns every transaction in a single response and the UI
renders all of them at once. Add pagination so the app only requests and shows a
page at a time, and make the search box work well against the full dataset.

You get to decide the API contract and the UI. We're interested in how you split
the work between client and server and why.

### Task 2 - Fix the summary total

The "Total processed" figure in the summary bar is wrong. Track down why and fix
it. Write a short note on the bug and how you fixed it.

### Task 3 - Improve the "New Transaction" form

There's a `New transaction` button in the top-right that opens a form at
`/transactions/new`. It works, but it's rough around the edges.

We've intentionally left it basic - use your judgment on what "good" means here
(validation, feedback, consistency with the rest of the app, and correct handling
of the money involved are all fair game). The backend endpoint behind it
(`POST /api/transactions` in `apps/api`) is also minimal; improve it as you see
fit.

### Task 4 - Add a transaction detail page

Add a dedicated page that shows the full details of a single transaction (for
example at `/transactions/:id`). Routing is already set up with react-router, and
the API already exposes `GET /api/transactions/:id`. Wire up navigation to it
from wherever makes sense, and handle the states you'd expect a real page to handle.

### Task 5 - Suggest 3–5 opportunities for improvement

Read through the codebase and write up 3 to 5 improvements you'd prioritize
if this were a real product - correctness, performance, security, accessibility,
testing, developer experience, whatever stands out. For each, a sentence or two
on the problem and how you'd address it. You don't need to implement these.

## A few short questions

Answer these in your own words in your `NOTES.md` - a few sentences each is
plenty. We care about your reasoning, not length.

1. **Data flow.** Trace what happens from a keystroke in the search box to the
   list updating on screen. What are the performance implications with the full
   dataset, and what would you change?
2. **Your Task 1 call.** How did you split pagination and search between the
   client and the server, and why? What would need to change if this table grew
   to ~10 million rows?
3. **Ship / no-ship.** Imagine you're reviewing this repo before it goes to
   production. What's the first thing you would refuse to ship as-is, and how
   would you fix it?

## Handing it back

Please include a short `NOTES.md` (or edit this section) covering:

- What you changed and why
- The Task 2 bug, in a sentence
- Your Task 5 write-up
- Your answers to the three short questions above
- Anything you'd have done with more time