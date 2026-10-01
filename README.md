# Quest Breed Schools

Website for Quest Breed Schools, a creche, nursery and primary school at Km 37, Lekki-Epe Expressway, opposite Enyo Filling Station, Mayfair Gardens, Ibeju, Lagos.

Plain HTML, CSS and JavaScript with no build step. `index.html` is the home page. Open it in a browser, or upload the folder to any web host.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: video hero, classes, films, chess, graduation, campus, admissions |
| `about.html` | Who we are, the crest, values, affirmations, school calendar |
| `learning.html` | Creche, Pre-Nursery, Nursery, Primary, ways of learning, weekly facts |
| `school-life.html` | Films, recent events, gallery preview |
| `gallery.html` | Full photo gallery with filters and viewer |
| `admissions.html` | Classes, steps to join, enquiry form, questions |
| `contact.html` | Address, phones, WhatsApp, email, map, message form |
| `404.html` | Page not found |

## Folders

```
assets/css/style.css   all styles (colours from the crest are at the top)
assets/js/main.js      menu, motion, films, gallery, forms
assets/fonts/          Fraunces, Figtree and Cinzel (self-hosted)
assets/video/          short silent loops cut from the school's Instagram reels
assets/images/         photographs (WebP) from the school's Instagram and Facebook
assets/logo/mark.svg   the crest, redrawn as a sharp vector
```

## Editing

- Text is written directly in each HTML file.
- Phone numbers, email and address appear in the header menu, footer and contact sections of each page.
- The WhatsApp number and email the forms send to are at the top of `assets/js/main.js`.
- Forms need no server: pressing send opens WhatsApp or the email app with the message ready.

## Publishing

Connect this repository to GitHub Pages, Netlify or Vercel (no build command, publish directory is the root). Once a domain is known, change the `og:image` tag in each page to the full address, for example `https://questbreedschools.com/assets/images/og-image.jpg`.
