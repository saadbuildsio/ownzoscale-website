# OwnzoScale website

Astro static site for ownzoscale.com, hosted on Netlify.

- `npm install`
- `npm run dev` to preview locally
- `npm run build` outputs to `dist/`

## Tests
- `npm test`: unit tests (form helpers, prices, content and brand rules)
- `npm run test:e2e`: browser tests of every page on desktop, tablet and phone (pages, menu, cookie banner, pricing tabs, forms, links, accessibility)
- `npm run test:all`: build, then both

## Branded enquiry emails (Resend)

Every form submission triggers `netlify/functions/submission-created.mjs`, which emails a branded HTML summary through Resend. The template is in `netlify/lib/email-template.mjs`.

Set these in Netlify > Project configuration > Environment variables, then redeploy:

| Variable | Needed | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | API key from resend.com |
| `NOTIFY_EMAIL` | Yes | Where the email goes (the Resend account email until the domain is verified) |
| `NOTIFY_FROM` | Later | e.g. `OwnzoScale Website <enquiries@ownzoscale.com>` once ownzoscale.com is verified in Resend |

If the variables are missing, the function does nothing and Netlify's plain email alert still arrives.
