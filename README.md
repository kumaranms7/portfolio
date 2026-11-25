# Kumaran M S: portfolio as a streaming service

A portfolio built like a streaming service. Every visit starts on a title screen with your name, role and
photo. One click opens "Who's visiting?", then the home page: a hero billboard and one long scroll with
everything on it. Only the projects open a detail page.

The website is the `site/` folder: plain HTML, CSS and JavaScript, about 350 KB, no build step and no
dependencies. Only that folder is ever published.

## What visitors get

- **Title screen (every load, every refresh).** Name, role, current position and your portrait. It waits
  for a click on "Enter portfolio". It never moves on by itself.
- **Who's visiting?** Your photo as the MAIN profile (the full story in order), then Recruiter, Client and
  Engineer. The choice changes the order of the sections and the hero buttons. The story is the same for everyone.
- **Hero billboard.** Name, role, quick facts and your portrait on the right, with three glass chips floating
  around the photo (left, right, bottom right). They pop in one by one, bob gently and drift with the mouse.
  Optional animated video (below).
- **Animated cursor (mouse users only).** A ring trails the pointer. Over cards it becomes a red disc with a
  play triangle, over buttons and links it grows. It sits above the detail windows too. Touch screens are unaffected.
- **What I do (the attention-seeking section, right after About).** Five panels side by side: Software development,
  Designing, SEO, AI-assisted development, Servers and deployments. The open panel grows and plays its own animated
  scene: code typing itself and the tests passing, a wireframe being painted in with a cursor click and a phone
  version, an SEO score climbing with checks ticking, a prompt turning into a reviewed change with a "Reviewed by
  Kumaran" stamp, a deploy with a server status panel. They open on click (or hover on a laptop), open one after
  another on their own (a thin bar along the top shows the time) until you touch them, lean towards the mouse, and
  have a Replay button. A scene only runs while it is open and on screen, and runs again each time it comes back.
  Under 1100 px the panels stack as an accordion. Reduced-motion visitors see the finished pictures. The scenes are pure
  HTML and CSS (no GIF files), so they are sharp and tiny.
- **Skill universe is tabs.** One tab per skill group (a list on a laptop, a swipeable row on a phone),
  arrow keys, Home and End work, and the skills show as tiles.
- **One long scroll.** About me, My journey (all five seasons printed in full, with the skills picked up
  in each), AI Lab, How I build with AI, Skill universe, Trophy room, My core five, Websites I've built and
  the End credits. Nothing in these sections needs a click.
- **Click-to-open details are projects only.** The three AI products, the five utilities and the four
  websites open a title page. Each AI Lab card says what the app IS (a hook question, one plain sentence, three
  things it does, the result as a small footer). Its popup tells the whole story: the problem, who it is for, how it
  works step by step, highlights, what keeps it safe, where AI is (and is not) used, the tech, the numbers. The three
  products show a demo video there (nothing downloads until you press play). The words come from reading the real
  applications and contain no client names, employer brand or source code.
- **Motion on every scroll, in and out.** Titles are unmasked as they enter, cards rise, slide, zoom or pop in
  one after another, then drift away as they leave, and the same plays backwards when you scroll up. Each
  section has a glow and a big outlined number that move at their own speed, the hero lifts away, the
  stat numbers count up each time they come into view, and a thin bar along the top shows progress.
  It is driven by the scroll position in CSS (`views.css`, section "MOTION"), so it costs almost nothing.
  Visitors who prefer reduced motion get the finished page with no movement.
- **Wild mode (on by default).** On top of the above: section titles fly in letter by letter in 3D, giant outlined
  words slide sideways between sections, the hero zooms past you while the photo turns away and the chips fly off,
  journey cards turn in 3D, icons spin and flip, a ring and an orb drift behind every section, a line draws above each
  title, the About quote lights up word by word, and the core five fly in one after another. It all follows the scroll
  position (in and out), uses only transform and opacity, and scrolled as smoothly as calm mode in my test.
  To dial it back, set `fx: 'calm'` in `content.js` (only the fade-and-slide reveals stay). The words in the bands are
  `marquee` in the same file. Visitors who prefer reduced motion get none of it.
- **One fixed-width column.** Sections sit in a centred container (`--wrap`, 1280 px, set at the top of
  `base.css`). The menu, hero text, scrolling rows and footer line up with it on any screen size.
- **Navigation.** What I do, Journey, AI Lab, Skills, Trophies and Contact scroll to their section and the menu
  highlights where you are. A LinkedIn icon sits in the menu bar on wide screens (`person.linkedin` in `content.js`
  is the one place to change the address; it is also in the footer, the End credits, the resume and the search-engine data in `index.html`). The "Continue exploring" tiles under the hero do the same.
- **Resume.** Its own page (`#/resume`) in a modern two-column layout: header card with your photo and contact chips,
  summary, experience timeline, featured projects as cards, skills as chips, highlights and recognition. It shows exactly
  the words of the PDF, because both are built from one file (`site/assets/js/resume.js`). Print gives a clean black-on-white copy.
- **Floating buttons.** A "Download resume" button (the PDF) sits bottom right on every page except the resume page, with three
  gentle pulses after the intro. A round "back to top" button appears above it once you scroll about a screen down. On a phone
  both sit above the bottom tab bar.
- **Trailer.** A 25-second story-style sequence with progress bars, pause, previous and next.
- **Phones.** Bottom tab bar, swipeable rows, same content.

## Folder layout

```
site/                  the public website (the only thing deployed)
  index.html           page shell: nav, hero, dialogs
  assets/
    js/content.js      ALL text, numbers, dates, skills, profiles, trophies, hero video. Edit facts here.
    js/render.js       builds the sections, resume and title pages from the content
    js/app.js          intro, profile chooser, scrolling, hero video, trailer, dialogs
    css/               base.css (tokens, nav, cards, dialogs, intro), views.css (hero and sections)
    fonts/, img/       self-hosted fonts and photos (works behind office firewalls)
    video/             create this folder for your hero clip (see below)
archive/               earlier versions, kept for reference and never published
  v1-retro/            the first, 2D game-style version
  v2-cinematic-3d/     the 3D version (with its build source)
.github/workflows/     deploys site/ to GitHub Pages
.gitignore             keeps timesheets, resumes, photos, videos and archives out of the repository
```

Your timesheets, resume PDFs, original photos and the reference video sit next to `site/`. `.gitignore`
excludes them, but the safest option is to move them out of this folder before you create the repository.

## Preview on your computer

```
cd site
python -m http.server 8080      # then open http://localhost:8080
```

Add `?nointro` to the address to skip the title screen while testing. Add `#story`, `#lab`, `#skills`,
`#trophies`, `#websites`, `#contact` or `#/resume` to open a section directly.

## The animated hero video

It is in place: `site/assets/video/hero.webm` and `hero.mp4` (960 x 960, 7.1 s, about 2 MB each), switched on in
`content.js` (`hero.video`, `mode: 'portrait'`). In portrait mode the clip sits inside the photo's own box, so it
always matches the photo's size and position, its edges are faded into the hero, and the photo fades out when it plays.
The 16:9 original is `hero-video-source.mp4` in the project root (not published).

**To replace it with a new clip** (16:9, 1080p, face centred, important motion inside the centre square):
1. Put the new file in the project root, then crop the centre square and make a seamless loop. This crops 960 x 960
   (about 12% tighter than the full square, to match the photo's framing), blends the last 19 frames into the first
   19 so the loop has no jump (adjust the frame numbers to your clip's length), and drops the sound:
   ```
   ffmpeg -i new.mp4 -filter_complex "[0:v]crop=960:960:480:90,fps=24,split=3[v1][v2][v3];[v1]trim=start_frame=171:end_frame=190,setpts=PTS-STARTPTS[c];[v2]trim=start_frame=0:end_frame=19,setpts=PTS-STARTPTS[a];[v3]trim=start_frame=19:end_frame=171,setpts=PTS-STARTPTS[b];[c][a]xfade=transition=fade:duration=0.7917:offset=0[x];[x][b]concat=n=2:v=1:a=0,format=yuv420p[out]" -map "[out]" -an -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart site/assets/video/hero.mp4
   ffmpeg -i site/assets/video/hero.mp4 -an -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 site/assets/video/hero.webm
   ```
2. Keep the names `hero.mp4` and `hero.webm`, or change `hero.video` in `content.js`.

**Other modes** (`hero.mode` in `content.js`):
   - `'portrait'` (current): the clip replaces the photo on the right. Use a square clip of you.
   - `'backdrop'`: the clip fills the banner behind your name and the photo stays on the right.
     A dark gradient keeps the text readable, so use a clip whose left half is not too bright.
   - To go back to the photo only, set `video: []`.

The clip plays muted and loops. It pauses when the banner is off screen or the tab is hidden, and a pause
button appears in the corner. Visitors who prefer reduced motion, or who have Data Saver on, get the photo
and the video is never downloaded. If the file is missing or fails, the photo shows as before.

## The End credits poster video

`site/assets/video/credits.webm` and `credits.mp4` (720 x 1080, about 12.8 s, about 0.7 and 1.2 MB) play on the End
credits poster, listed in `content.js` as `posterVideo` (set it to `[]` for the still picture only). It loads only when
you scroll near it, plays only while on screen, has a pause button, and reduced-motion or Data Saver visitors keep the
still picture. The still (`stylish.webp`) is the camera-facing smile, so the loop starts exactly where the picture is.
The loop is: hold the smile, look down and work, then the same motion in reverse. The source clip is
`credits-video-source.mp4` in the project root (it has an AI-tool watermark in the bottom-right corner, which I patched
out with the clean background; to remake the loop, repeat the same steps with a new clip).

## Edit the content

| To change | Edit |
|---|---|
| Career seasons, bullets, dates, skills | `site/assets/js/content.js` (`journey`, `skills`) |
| The resume (page AND PDF) | `site/assets/js/resume.js`, then run `node tools/make-resume.mjs` to rebuild `site/assets/Kumaran_M_S_Resume.pdf` (needs Edge or Chrome; set `EDGE_PATH` if yours is elsewhere) |
| The eight AI Lab apps: card text and popup text | `site/assets/js/apps.js`. Each app has `kind`, `card` (hook, what, 3 points, result) and `detail` (what, problem, who, steps, highlight groups, safety, AI note, tech chips, numbers). Colours, icons, demo videos and the small before/after visuals are in `products` and `gadgets` in `content.js` |
| Title screen text, About quote and facts, section headings | `intro`, `about`, `blocks` in `content.js` |
| The three chips around your photo | `hero.chips` in `content.js` (`pos`: `left`, `right`, `br`) |
| Profiles and the order of sections for each | `profiles` (`order`) in `content.js` |
| The five crafts in "What I do": names, one-liners, numbers, tool chips | `craft` in `content.js`. The animated scenes are drawn in `SCENES` in `render.js` and styled and timed in `site/assets/css/craft.css` (the delays are `--d` values in milliseconds) |
| Websites built, core five, trophies, trailer scenes, credits | `websites`, `core`, `trophies`, `trailer`, `credits` in `content.js` |
| Phone, email, LinkedIn, the two prefilled email templates | `person` and `mail` in `content.js` |
| Hero wording | `site/index.html` (the `hero` block) |
| Colours, container width (`--wrap`) | the `:root` block at the top of `site/assets/css/base.css` |
| Which block animates how | `data-reveal` (`up`, `left`, `right`, `zoom`, `pop`, `title`) in `render.js`; the moves are in `views.css` |

## The product demo videos

The three product pages (GAds Dashboard, Site Modernizer, Form and Lead Platform) each play a demo video:
`site/assets/video/demo-gads.mp4`, `demo-modernizer.mp4`, `demo-forms.mp4` (720p, 3 to 9 MB each) with a
poster image in `site/assets/img/demo-*.webp`. They are listed under `products` in `content.js` (`video`: file,
poster, length, note). The full-size originals stay in the project root and are not published. To replace one,
re-encode the new recording the same way:
```
ffmpeg -i new.mp4 -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -crf 27 -preset medium -c:a aac -b:a 64k -movflags +faststart site/assets/video/demo-gads.mp4
```
To remove a video, delete its `video:` line in `content.js`.

**Videos are switched off for now.** `demoVideos: false` in `content.js` hides them, and `.gitignore` keeps the three
`demo-*.mp4` files and their `demo-*.webp` posters out of git, so they are not published. Once you have checked what is
on screen (employer logo, account names, a real client), set `demoVideos: true`, delete the two `demo-` lines from
`.gitignore`, commit the files and push.

Product names are generic. Before you publish a video, check what is on screen: no real client names, account IDs, phone numbers, addresses or photos of real people, and no credentials. Keep it that way: no client names,
account IDs, screenshots or source code of the real tools in `site/`.

## The resume PDF

`site/assets/Kumaran_M_S_Resume.pdf` is generated, not drawn by hand: `node tools/make-resume.mjs` reads `resume.js` and prints
a two-page, single-column, text-based PDF (good for job-site parsers) with Edge or Chrome in headless mode. Change the words in
`resume.js`, run the command, commit both files. Keep a copy in your Resume folder if you want it next to your other versions.

## Search engines and no-JavaScript readers

The page is drawn by JavaScript, so `site/index.html` also carries a plain-text copy of all the content inside
`<noscript>` (about, what I do, all eight apps in full, journey, skills, trophies, websites). `site/sitemap.xml` and
`site/404.html` are there too. After you change `content.js` or `apps.js`, refresh the copy and the sitemap date:

```
node tools/make-static.mjs
```

(Node only, no packages.) `robots.txt` is not included on purpose: a project site such as `/portfolio/` is not allowed
to serve one (crawlers only read it at the root of `kumaranms7.github.io`). Add it if you move to your own domain, and
submit `sitemap.xml` in Google Search Console.

Speed: the card pictures load only as they near the screen, the main fonts are preloaded, and the footer is held below the fold
until the sections are drawn (this keeps layout shift at 0).

## Photos

The cut-outs were made from your studio photos with a local background-remover; nothing was uploaded.

| File | Made from | Used on |
|---|---|---|
| `site/assets/img/portrait.webp` | `portfolio-portrait-4k.png` | title screen, hero banner, link preview image |
| `site/assets/img/stylish.webp` | `credits-image-source.png` (standing, laptop open; the earlier standing photo is saved as `card-originals/stylish-previous.webp`) | End credits |
| `site/assets/img/kumaran-face.webp` | `portfolio-portrait-4k.png` | the small avatar in the menu |

To change one, cut the new photo out (transparent background), save it as WebP and replace the file with
the same name. `portrait.webp` is about 1200 x 1200 and `stylish.webp` is 800 x 1200.
`og.jpg` is the link preview image (1200 x 630); redo it if you change `portrait.webp`.

## Card background pictures

Three places can have a picture behind the colour: the "Continue exploring" cards, the "My journey" season
panels and the Trophies. The current colour overlay stays on top of each picture, and a card without a
picture keeps its plain colour.

1. Put WebP files in `site/assets/img/cards/` with exactly these names:
   - Continue exploring: `about`, `story`, `lab`, `method`, `skills`, `trophies`, `core`, `websites`, `resume`, `contact`, and `craft` (the new "What I do" tile, no picture yet)
   - Journey seasons: `season-1` to `season-5` (Data entry to QA/QC, Developer, Software Engineer, Senior Engineer, AI automation)
   - Trophies: `trophy-1` to `trophy-7`. Each trophy in `content.js` names its own picture (`img`), so adding a trophy
     never shifts the pictures. The AI Fluency certificate has `img: ''` (no picture yet): save one as `trophy-8.webp`, set `img: 'trophy-8'` on it and add `'trophy-8'` to `have`.
   For example `site/assets/img/cards/about.webp`.
2. In `site/assets/js/content.js`, find `images:` and list the files you have in `have` (it is a list now, so a name with no
   file never causes a failed download). Add `'craft'` once `cards/craft.webp` exists.
3. To make the colour stronger or weaker, change the blend in `base.css`: `--blend` for the cards and seasons
   (default `overlay`; try `multiply` for stronger colour, `soft-light` for weaker) and `--blend-t` for the trophies.

Keep each file under about 120 KB (1280 px wide for the cards, 1000 px for the seasons, 1200 px for the trophies).
All 22 of the first three groups are in and switched on. The full-size originals are in `card-originals/` (not published); the
files in `site/` are the lighter copies (cards resized to 1280 px, trophies brightened because the originals are very dark).
To swap one, put the new file in `site/assets/img/cards/` with the same name.

The three AI Lab product cards and their popup banners use a screenshot of each app's dashboard page:
`app-gads.webp`, `app-modernizer.webp`, `app-forms.webp` (same folder, about 1200 px wide, 15 to 30 KB). They sit on
top of the card colour and are blended into it (`overlay`, set by `--blend` on `.orig` in `views.css` and on
`.title__banner` in `base.css`). They were cropped from frames of the demo videos so that the company logo, any
client name and the caption pills are out of the picture. When you swap one, crop it the same way. The three `app-`
names are in `have` already.

## Publish on GitHub Pages

1. Create a new GitHub repository. Free Pages needs it public, which is safe because the repository
   only contains the site, this README and the workflow.
2. In this folder run:
   ```
   git init
   git add .
   git status                # check: no .xlsx, .pdf, .png, .mp4 files from the root are listed
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: Settings, Pages, Source: **GitHub Actions**. The workflow publishes `site/` on every push to `main`.
4. Optional custom domain: add it under Settings, Pages, then add a file `site/CNAME` containing the domain.

## Before you share the link

- [ ] Put your real URL in the head of `site/index.html`: change `og:image` to an absolute URL
      (for example `https://you.github.io/repo/assets/img/og.jpg`) and add `<link rel="canonical" href="...">`.
      Link previews on LinkedIn and chat apps need this.
- [ ] Read `content.js` once and confirm every fact. These need your confirmation:
      AI work start (`2025 – now`), which projects belong to Galaxy Weblinks and which to CG-VAK,
      "up to 10 clients" and "up to 5 junior developers" (from your AI resume).
- [ ] Make a master resume PDF and add a download button. "Print or save as PDF" on the Resume page works today.
- [ ] Open the site on your phone, on a Windows laptop at 1366 x 768 and on a full-HD monitor.
- [ ] Ask permission if you want to show the tools more specifically than the generic descriptions.

## About the design

The layout idea comes from the streaming-service portfolio reel you shared. The wording, colours, names
and code here are original: no streaming brand name, logo or text is used, and the site never calls
itself anything but your portfolio. Keep it that way if you edit the copy.
