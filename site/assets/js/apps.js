/* ------------------------------------------------------------------
   The eight AI Lab applications: the words on each card and in each popup.
   Everything here comes from reading the real applications (their docs and code). Generic on purpose:
   no client names, no employer brand, no screenshots, no source code.

   Per application:
     kind    small label on the card
     card    { hook, what, points[3], result }   the teaser: what it IS and why you would open it
     detail  { what, problem, who, steps[], groups[{h, items[]}], safety[], ai, tech[], stats[[big, label]] }   the popup
   The keys match C.products (gads, modernizer, forms) and C.gadgets[].id (enhancer, meta, canonical, report, images).
------------------------------------------------------------------- */
(function () {
  'use strict';
  var AQ = (window.AQ = window.AQ || {});
  AQ.content = AQ.content || {};

  AQ.content.apps = {

    /* ============================ PRODUCTS ============================ */

    gads: {
      kind: 'Windows app · Google Ads',
      card: {
        hook: 'What if your ad account could answer questions, and could never publish anything on its own?',
        what: 'One desktop app to audit, report on and edit many Google Ads accounts, with Claude drafting the ads.',
        points: ['Ask the account anything in plain English, answered from live data', 'Builds headlines, keywords and extensions that pass Google’s limits', 'Every change is previewed, confirmed and can be rolled back'],
        result: 'Reporting: 1–2 hours → under 1 minute',
      },
      detail: {
        what: 'GAds Dashboard connects to Google Ads and puts every account in one Windows app: dashboards, 12 report views, a 9-tab audit, campaign and keyword managers, and AI builders for ads. Claude reads live account data to answer questions and draft copy. A person always clicks publish.',
        problem: 'Managing paid search means logging into each account, exporting spreadsheets for reports, hand-writing ad copy to Google’s character limits and hunting for wasted search terms. It adds up to hours of repeat work every week.',
        who: 'Paid-search managers who run many accounts at a marketing agency.',
        steps: [
          'Pick an account and a date range. Live data loads from the Google Ads API.',
          'Browse the dashboard, reports, keywords and audit. AI adds recommendations beside the numbers.',
          'Ask the chat assistant a question. It answers from live data using read-only tools.',
          'Build ads or keywords with the AI builders. Every line is checked and scored before you see it.',
          'Review the change. Google’s own validation runs first, then you confirm it is a live change.',
          'A change log keeps before and after copies, with one-click rollback.',
        ],
        groups: [
          { h: 'See everything', items: ['Dashboard with KPIs, charts, a call-lead summary and budget pacing', '12 report views (campaigns, devices, networks, form and phone conversions and more) with CSV and PDF export', 'Executive Summary report with about 20 sections you can switch on or off'] },
          { h: 'Audit', items: ['9 audit tabs: campaigns, keywords, ads, assets, conversion tracking, performance, duplicates and policy issues', 'Finds negative keywords that block good ones, and ad groups that compete for the same searches'] },
          { h: 'Manage', items: ['Create and edit Search, Display, Performance Max, Shopping and Video campaigns', 'Bulk keyword and negative-keyword tools, with AI-flagged wasted spend', 'Ad group and asset group managers'] },
          { h: 'AI builders', items: ['Responsive Search Ad builder: 15 headlines and 4 descriptions, scored', 'Sitelinks, callouts, structured snippets and call assets', 'Keyword planner and Quality Score analysis'] },
        ],
        safety: [
          'Google’s validate-only check runs before any live change',
          'Publishing needs a “this is a live change” tick, so nothing goes out by accident',
          'The change log keeps the last 200 changes with rollback. Replaced ads are paused, never deleted',
          'AI copy is cleaned and length-checked, rewritten up to 3 times, then swapped for a safe fallback line if it still fails',
          'The chat assistant has 9 read-only tools and no way to write',
          'Settings and keys stay on the machine, never in the code',
        ],
        ai: 'Claude writes and checks ad copy, keyword ideas and account reviews, classifies search terms and answers questions. It is never allowed to invent offers, add phone numbers, make “best” or “guaranteed” claims, or publish anything itself.',
        tech: ['Electron 40', 'React 18', 'Vite', 'Google Ads API', 'Claude API', 'Vitest', 'Windows installer'],
        stats: [['< 1 min', 'Google Ads reporting, down from 1–2 hours'], ['85–95%', 'less manual optimisation'], ['62', 'automated tests'], ['~6 weeks', 'built solo with Claude Code']],
      },
    },

    modernizer: {
      kind: 'Windows app · Website redesign',
      card: {
        hook: 'How do you redesign every page of a website and prove nothing was lost?',
        what: 'A desktop app that gives an old site a modern design while code checks that every sentence, link, phone number and tracking code survived.',
        points: ['Choose from 14 hand-built designs and preview each beside the original', 'Optionally converts images and polishes copy with AI, under strict checks', 'A page that loses anything fails and keeps its original file'],
        result: '43-point launch checklist',
      },
      detail: {
        what: 'Site Modernizer takes a website folder and rebuilds its pages in a new design. Each old page is read, fitted into the chosen layout and then verified against the original. Images, copy, meta tags and schema can be improved too, and the result is packaged with a rollback.',
        problem: 'Redesigning a site by hand means rebuilding every page, then re-checking titles, meta tags, links, forms and tracking codes. One missed phone number or analytics tag quietly costs leads or rankings.',
        who: 'Web and SEO agencies refreshing client websites.',
        steps: [
          'Point the app at a site folder and fill in the business profile: what it does, approved facts and claims never to make.',
          'It scans the site and sorts every page into one of 12 page types, then audits it for 23 kinds of problem.',
          'Optional: images are backed up in a verified zip, converted to WebP, and every reference is rewritten and rechecked.',
          'Choose a design, pick brand colours and preview it beside the original. Fine-tune sections or ask the AI assistant.',
          'Choose how to treat the words: keep them, enhance them (grammar and clarity only) or rewrite them, then approve.',
          'Build. Each page is rebuilt, given finished head tags and compared with its original.',
          'Validate and package: a 43-check list, link check, real-browser test, before and after score, report, deploy zip and rollback zip.',
        ],
        groups: [
          { h: 'Designs', items: ['14 hand-coded designs, each with its own header, hero, footer and section layouts', 'Brand colours from the site, its logo or one of 12 industry presets, with 94 bundled font files', 'Side-by-side preview, per-section layouts and an AI design assistant'] },
          { h: 'Keeps everything', items: ['Reads old pages by what each row is, not by class names', 'Recognises cards, tabs, accordions, tables, embeds and forms by shape', 'Pages it cannot read with confidence are left untouched'] },
          { h: 'Images and words (optional)', items: ['JPG and PNG become WebP in several sizes, with every reference updated and rechecked', 'About 30 rule checks on AI copy, plus claim checks against the approved business profile'] },
          { h: 'Launch checks', items: ['A 43-check SEO, technical and accessibility list, and a link check', 'Real-browser test on a phone profile, slow 4G and a throttled CPU: speed, layout shift and an accessibility scan', 'Before and after score per page, counted from the pages and never typed in'] },
        ],
        safety: [
          'A page fails if its title or meta description changed, the canonical is wrong, a phone number, tracking ID, form or head script is lost, a link or image is lost, or any text is lost. Failed pages keep their original file',
          'Claims such as “24/7”, “licensed” or “guaranteed” are allowed only when the approved business profile backs them up. Prices and discounts are always banned',
          'A verified zip backup is taken before anything is applied to the site folder, and any page or the whole site can be restored',
          'PHP pages are never overwritten',
          'Nothing is uploaded: the app packages a deploy zip and a rollback zip and stops there',
          'The AI never gets the last word: every answer goes through checks, and a failed one gets one repair try, then goes to review',
        ],
        ai: 'Claude writes page copy, meta tags and alt text, helps with design tweaks and reads unusual page rows. The 14 designs, the preservation checks, the scoring, the canonical logic and the packaging are plain hand-written code. Without an API key everything except the AI features still works.',
        tech: ['Node.js 22', 'Express 5', 'Electron', 'Tailwind 4', 'Cheerio', 'Sharp', 'Playwright with Edge', 'axe-core', 'Claude API'],
        stats: [['14', 'hand-coded designs'], ['43', 'launch checks'], ['12', 'page types recognised'], ['~315', 'automated tests']],
      },
    },

    forms: {
      kind: 'Web platform · PHP and MySQL',
      card: {
        hook: 'Can one small app run the lead forms for dozens of websites and catch spam you never see?',
        what: 'A self-hosted form builder and lead inbox. Build a form by drag and drop, embed it anywhere and follow every enquiry to the end.',
        points: ['23 field types, multi-step forms and conditional logic', 'Embeds as real HTML, with 9 layers of invisible spam defence', 'Leads move from New to Won with notes, assignees and email replies'],
        result: 'One login runs every client site',
      },
      detail: {
        what: 'Form and Lead Platform lets an agency create forms by drag and drop, place them on any client website and track each enquiry from the first message to follow-up. Each client site has its own team, forms, spam rules and settings, all behind one login.',
        problem: 'Separate form plugins on every site mean leads get lost in scattered inboxes, spam slips through and nobody sees the whole picture.',
        who: 'Agencies that run forms for many websites, and each client’s own team.',
        steps: [
          'A super admin adds a website, its allowed domains, logo and users.',
          'An editor builds a form from 8 templates or from scratch, then sets fields, logic, theme and notifications.',
          'The form is embedded as full HTML, a PHP snippet or a JavaScript snippet. It is real markup, never an iframe.',
          'A visitor submits. The server checks every field, runs the spam layers and answers instantly.',
          'Emails, webhooks and auto-replies then run from a queue that retries failures.',
          'The team works the Entries inbox: status, assignee, internal notes, email replies and CSV or Excel export.',
          'Dashboards and a monthly all-sites report email close the loop.',
        ],
        groups: [
          { h: 'Builder', items: ['23 field types including name, address, phone, file upload, signature, rating, price and calculated fields', 'Show and hide logic with 8 operators, multi-step forms and save-and-resume by email', '7 theme presets plus custom colours, undo and redo, and device preview'] },
          { h: 'Embedding', items: ['3 ways to embed, with no layout shift and edits that go live without re-pasting', 'The PHP embed keeps showing the last good copy if the app is unreachable', 'Captcha scripts load only when a visitor starts the form, to protect page speed'] },
          { h: 'Many sites, many teams', items: ['One login, per-site roles (admin, editor, viewer) and a super admin', 'Each site has its own forms, entries, spam rules, SMTP, logo and retention rules'] },
          { h: 'Leads', items: ['Status, assignee, notes timeline, filters and bulk actions', 'Campaign data captured: UTM tags, click IDs, referrer and source page', 'CSV and Excel import and export, and signed webhooks with delivery logs'] },
          { h: 'Operations', items: ['Backups, an in-app updater with rollback, retention rules and cron', 'Email, queue and activity logs, and dashboards with charts', 'A monthly report: one combined email plus a printable page for each site'] },
        ],
        safety: [
          'Spam defence in 9 layers: honeypot, a signed single-use token, server-clock fill time, rate limits, injection checks, a disposable-email list, duplicate detection, custom block lists and captcha. Spam goes to a recoverable folder and never triggers an email',
          'Passwords are hashed, accounts lock after 5 bad logins, and optional email 2FA can trust a device for 30 days',
          'Every request carries a CSRF token and every database call is a prepared statement',
          'Uploads are checked by extension, real file type and content, optionally scanned with ClamAV, and stored outside the web root under random names',
          'Every query is scoped to its website, so one client can never see another’s leads',
          'Exports guard against spreadsheet formula injection, and webhooks are signed with HMAC-SHA256',
        ],
        ai: 'None. It is plain PHP and rules, so every decision it makes can be traced.',
        tech: ['PHP 8.1', 'MySQL / MariaDB', 'Vanilla JavaScript', 'PHPMailer', '23 tables', '8 migrations'],
        stats: [['23', 'field types'], ['9', 'spam layers'], ['3', 'roles per site'], ['v2.4.0', 'current version']],
      },
    },

    /* ============================ UTILITIES ============================ */

    enhancer: {
      kind: 'Windows app · SEO copy',
      card: {
        hook: 'What if AI could rewrite hundreds of pages for SEO and never touch a tag or a line of PHP?',
        what: 'A desktop app that scores every page of a site, then has Claude rewrite only the visible words and scores them again.',
        points: ['A local 0–100 score across 7 categories, before and after', 'Claude sees plain text pieces, never HTML or PHP', 'Pages already scoring 90+ skip the AI, so cost stays low'],
        result: 'Average SEO score 75 → 90+',
      },
      detail: {
        what: 'Page Content Enhancer scores each page of a PHP or HTML website against a seven-part SEO rubric. Claude then rewrites only the visible text, such as titles, headings, paragraphs and the meta description, to fix the weak spots. The page is scored again to show the gain.',
        problem: 'Sites with hundreds of near-identical service or location pages need unique, well-structured copy on every one. Doing it by hand takes weeks, and judging the result by eye is guesswork.',
        who: 'SEO and web teams that manage large sets of service and location pages.',
        steps: [
          'Pick the site folder and file type, describe the business, and choose a Claude model and effort level.',
          'The app finds every page and swaps all PHP code for placeholders.',
          'It pulls out each piece of text with its exact position and scores the page from 0 to 100, with no AI call.',
          'Pages already at 90 or above are skipped. The rest go to Claude in chunks.',
          'The rewrite is scored again. Up to two refinement passes target the weakest categories, and the best pass wins.',
          'The new text goes back in its exact place and the PHP is restored. A dashboard shows before and after scores, tokens and cost.',
        ],
        groups: [
          { h: 'Scoring (no AI)', items: ['7 weighted categories: Content Quality, AI/LLM Visibility, Local SEO, UX and Readability, EEAT, Conversion and SEO Structure', 'Penalties for thin pages, keyword stuffing, duplicate paragraphs, no call to action and no location signal', 'Ignores things the tool cannot change (canonicals, schema, link URLs), so a rerun can always improve a page'] },
          { h: 'What it rewrites', items: ['Titles, headings, paragraphs, list items, table text and buttons', 'Meta description and image alt text', 'Text held in PHP variables that is really page copy, such as intros and FAQs'] },
          { h: 'What it leaves alone', items: ['Navigation, headers, footers and menus', 'Scripts, styles, schema and link URLs', 'PHP logic of any kind'] },
          { h: 'Cost control', items: ['Skips pages that already score 90 or more', 'Stops early when a pass does not improve the score or a 120-second file budget runs out', 'Three Claude models and three effort levels, with tokens and cost tracked per file'] },
        ],
        safety: [
          'Claude receives only numbered text pieces (an id, a role and the text), never markup or code',
          'Replies must match a strict JSON schema. Unknown or missing items fall back to the original text',
          'PHP blocks are swapped for placeholders before parsing and restored afterwards',
          'One bad file is logged as an error without stopping the batch',
          'The prompt forbids invented facts and keeps each rewrite close to the original length',
          'Built to run on a copy of the site folder: review the result, then copy it across',
        ],
        ai: 'Claude rewrites the text and receives plain-English revision notes from the local scorer. The scoring, the parsing and the write-back are ordinary code.',
        tech: ['Python 3', 'CustomTkinter', 'Claude API (structured output)', 'PyInstaller', 'Windows .exe'],
        stats: [['75 → 90+', 'average SEO score'], ['7', 'scoring categories'], ['1,000+', 'pages tested on one site'], ['90', 'score that skips the AI call']],
      },
    },

    meta: {
      kind: 'Windows app · Titles and schema',
      card: {
        hook: 'How do you let AI rewrite the titles of 3,000 pages and guarantee not one page gets worse?',
        what: 'A desktop app that writes unique titles, descriptions, headings, schema and share tags for every page, scoring each page before and after.',
        points: ['Unique title, description and H1 per page, plus schema, social tags and alt text', 'Dry run with a cost estimate first, then backup and one-click restore', 'Any change that lowers a page’s score is reverted'],
        result: 'About 90% less manual effort',
      },
      detail: {
        what: 'Meta Tag Updater rewrites the shop window of every page on a static website: a unique title, description and main heading, plus structured data, social share tags and image alt text. Each change is scored before and after, so no page gets worse.',
        problem: 'Writing a unique title, description and heading for hundreds or thousands of pages by hand is slow, and big sites end up with copy-pasted tags that search engines ignore.',
        who: 'Agency teams onboarding a client website.',
        steps: [
          'Pick the site folder. Optionally let the app read the live site to learn the business’s name, services and areas. Every fact is checked against the page text.',
          'Choose a Claude model, see a cost estimate and start with a dry run that writes nothing.',
          'Step one, no AI cost: add or fix canonical tags and fix internal links that point at redirected pages.',
          'Step two: Claude gets each page’s text and context, 10 pages per call, plus titles already used elsewhere so it avoids repeats.',
          'Results are checked for length, finished sentences and near-duplicates. Failures are rewritten up to 3 times or sent to a review list.',
          'Each page is scored before and after. Any field that lowers the score is reverted.',
          'Originals are backed up once, files are written safely, and an HTML report and CSV are saved.',
        ],
        groups: [
          { h: 'What it writes', items: ['Unique meta title (brand added by code), description and H1', 'Schema: WebPage, Service, LocalBusiness, Article, AboutPage, ContactPage and CollectionPage, plus optional breadcrumbs and an FAQ built from existing Q&A', 'Open Graph and Twitter cards with a share image picked from the page', 'Image alt text and lazy loading, and a robots tag if one is missing'] },
          { h: 'Site-wide', items: ['Canonical add and fix that respects the site’s redirect rules', 'Sitemap check and a clean sitemap.xml rebuild', 'A near-duplicate page detector that gives city-swap pages different openings'] },
          { h: 'In your control', items: ['Dry run with a cost estimate', 'Review window: edit by hand, regenerate one field or approve page by page', 'Haiku, Sonnet or Opus picker, and batching to keep tokens low', 'Resume and retry-failed after a rate limit or a stopped run'] },
          { h: 'Reporting', items: ['Client-ready HTML report with before and after scores and charts, plus a results CSV', 'A 100-point internal score with about 40 checks. It is the tool’s own benchmark, not a Google score'] },
        ],
        safety: [
          'A dry run writes nothing',
          'Originals are copied once to a backup folder outside the site, with a one-click restore',
          'Score protection: a page’s total and every category must be at least the original, or the original field is kept',
          'AI may not write phone numbers, addresses, ratings, prices or URLs into schema. Those come only from verified business details',
          'Text is rewritten until it fits, never cut off mid-sentence',
          'Files keep their original encoding and line endings, and writes are atomic',
          'A PHP-template edition skips an edit instead of guessing when a title is built dynamically',
        ],
        ai: 'Claude writes titles, descriptions, headings and alt text, and extracts business facts that code then verifies. Length checks, scoring, schema building and file writing are plain code.',
        tech: ['Python 3', 'Tkinter', 'Claude API (streaming)', 'System keyring', 'PyInstaller', '184 test functions'],
        stats: [['~90%', 'less manual effort'], ['~40', 'quality checks per page'], ['184', 'test functions'], ['3,000+', 'page sites stay unique']],
      },
    },

    canonical: {
      kind: 'Windows app · SEO clean-up',
      card: {
        hook: 'What happens to your rankings when hundreds of pages disagree about their own address?',
        what: 'A desktop app that scans a site folder and gives every page the right canonical tag, the line that tells Google its one official address.',
        points: ['Adds missing tags, fixes wrong ones and leaves correct ones alone', 'Reads the site’s redirect rules and removes canonicals from redirected pages', 'Dry run by default: see every change before it happens'],
        result: 'Live on 30+ client sites',
      },
      detail: {
        what: 'Canonical Injector scans a website folder and makes sure every HTML and PHP page carries the right canonical tag. It builds each page’s official address from the domain and the file path, and it works around the site’s own redirects.',
        problem: 'When duplicate or redirected URLs split a page’s ranking, search results suffer. Fixing it means opening hundreds of files one by one to add, correct or remove the tag.',
        who: 'SEO and web developers cleaning up a client website.',
        steps: [
          'Enter the site’s domain and choose its folder.',
          'Choose Dry Run (the default) or Live Run.',
          'The app reads the site’s .htaccess and extracts its 301 redirect rules.',
          'It finds every HTML and PHP file and works out each page’s canonical address. Index files map to the folder address.',
          'It inserts, replaces, skips or removes the tag, with a colour-coded live log.',
          'A timestamped report lists every action and the redirect rule behind it.',
        ],
        groups: [
          { h: 'Canonical logic', items: ['index.html and index.php map to the folder URL, and every other page keeps its full path', 'Missing tag: inserted just before the closing head tag, matching the page’s indentation', 'Wrong tag: replaced, with the old value logged', 'Correct tag: left alone, so running it twice changes nothing'] },
          { h: 'Redirect-aware', items: ['Reads Redirect 301, RedirectMatch 301 and RewriteRule [R=301] rules', 'Pages that redirect elsewhere get no canonical, and any old one is removed', 'Site-wide rules such as force www or https are recognised and not treated as page redirects'] },
          { h: 'In your control', items: ['Dry Run shows exactly what a Live Run would do', 'Five clear statuses (inserted, replaced, skipped, skipped for redirect, error) and a summary', 'A standalone command-line version too'] },
        ],
        safety: [
          'Dry Run is the default, and the guide says to always run it first',
          'The tag goes on its own line and copies the page’s indentation, so formatting is preserved',
          'A file is only written when something actually changes',
          'Pages with no closing head tag are reported as errors and left unmodified',
          'Live Run edits files in place, so keep a backup of the site first',
        ],
        ai: 'None. It is plain, predictable code, so every change can be explained and repeated.',
        tech: ['Python 3', 'Tkinter', 'Standard library only', 'PyInstaller single .exe', 'One-click build'],
        stats: [['30+', 'client sites'], ['5', 'action statuses'], ['3', 'redirect rule types read'], ['0', 'extra dependencies']],
      },
    },

    report: {
      kind: 'Windows app · Client reporting',
      card: {
        hook: 'What if a spreadsheet of thousands of page changes became a client-ready report in minutes?',
        what: 'A desktop app that turns the results of a site-wide SEO run into a branded report with KPI cards, charts and before and after scores.',
        points: ['KPI cards, top wins, a quality table and 3 charts', 'Every number is calculated from your data, none written by AI', 'One folder per client, ready to open or print to PDF'],
        result: '1–2 hours → about 5 minutes per report',
      },
      detail: {
        what: 'SEO Report Automation turns the results spreadsheet from a site-wide optimisation run into a polished, branded client report: KPI cards, charts, top wins and before and after scores, in a self-contained web page.',
        problem: 'After optimising a whole site, someone has to turn thousands of rows into a report a client can read. Built by hand, it takes one to two hours every time.',
        who: 'Account managers and SEO teams who report to clients.',
        steps: [
          'Open the app. It is a single Windows program with nothing to install.',
          'Enter the client’s details and pick the results CSV.',
          'Type the before and after scores for the eight SEO categories.',
          'Click Generate and watch the live log.',
          'The app checks the columns, summarises the data, draws the charts and builds the report.',
          'Open the HTML report, which prints cleanly to PDF. Everything is kept in a folder per client.',
        ],
        groups: [
          { h: 'Analysis, all computed', items: ['Coverage of titles, descriptions, H1s and schema added', 'Title and description length statistics', 'Page volume and “action density” for each site section'] },
          { h: 'The report', items: ['Hero header, executive summary and 5 KPI cards', 'Top wins picked by rules from the real data', 'Quality snapshot table, 3 charts, and cards for search visibility, AI readiness and next steps'] },
          { h: 'Output', items: ['A self-contained, responsive HTML report', 'PNG charts at 200 dpi and a summary JSON for reuse', 'One folder per client, named safely'] },
        ],
        safety: [
          'Every number is calculated in code from the CSV. Nothing is written by AI or invented',
          'Missing columns raise a clear error that names exactly what is absent',
          'Blank cells are handled safely, so a messy export cannot crash the run',
          'Pages with errors show as “Review needed” instead of being hidden',
          'The eight category scores are typed in by a person, because they are a judgement call',
        ],
        ai: 'None at runtime, on purpose. The report is deterministic, so every figure can be traced back to the spreadsheet.',
        tech: ['Python 3', 'pandas', 'matplotlib', 'Tkinter', 'PyInstaller single .exe'],
        stats: [['1–2 h → 5 min', 'per report'], ['7', 'client projects'], ['3', 'charts per report'], ['24', 'CSV columns checked']],
      },
    },

    images: {
      kind: 'Windows app · Site clean-up',
      card: {
        hook: 'Which of your 50,000 images does your site actually use? Find out, and undo it if you’re wrong.',
        what: 'A desktop app that finds images no page, stylesheet or script uses, and moves them to a dated backup instead of deleting them.',
        points: ['Reads 14 kinds of image reference: srcset, CSS, JSON-LD, manifests, scripts and more', 'Spots exact duplicate files with SHA-256', 'Restore the whole backup or just a few files'],
        result: '0 files auto-deleted',
      },
      detail: {
        what: 'Image Cleaner scans a website’s files and works out which images nothing actually uses: no page, stylesheet, script or data file points at them. It moves the leftovers into a dated backup folder with a manifest. Nothing is ever deleted.',
        problem: 'Old sites collect thousands of images nobody uses. They bloat storage, backups and migrations, and nobody can tell which are safe to remove.',
        who: 'Developers and agencies who maintain or migrate large sites.',
        steps: [
          'Pick the site folder, an output folder and a backup folder. Optionally add a hosting provider’s orphan-image report.',
          'Scan: the app walks the site and records every image and every source file, hashing images when duplicate detection is on.',
          'Parse: each source file is read once and 14 extractors collect every image reference, with file and line number.',
          'Compare: every reference is resolved to one key, the way a browser would, and each image is marked Referenced, Unused or Protected.',
          'Review: live stat cards, CSV reports and an HTML dashboard with search and filters.',
          'Move: after a confirmation that shows the count and size, unused images go to a dated backup folder.',
          'Restore: put back the whole backup, or only the files you pick.',
        ],
        groups: [
          { h: 'What it reads', items: ['HTML: img src, every srcset candidate, source tags, inline styles, og:image and Twitter images, favicons and app icons', 'CSS url() values and style blocks', 'JSON-LD image fields and manifest icons and screenshots', 'Quoted image paths in JavaScript, plus text and XML files'] },
          { h: 'Smart matching', items: ['Resolves relative, root-relative, ../ and absolute URLs to the same key', '14 extractors, and new rules plug in easily', 'Lists broken references: pages pointing at images that do not exist'] },
          { h: 'Duplicates', items: ['Exact duplicates grouped by SHA-256', 'Suggests which copy to keep and sorts groups by wasted space'] },
          { h: 'Reports', items: ['7 CSV reports and an HTML dashboard with search, filters and pagination', 'Space that could be reclaimed, front and centre'] },
        ],
        safety: [
          'It never deletes. Unused images are moved, and only after a confirmation',
          'Every move is logged in a manifest, and restore never overwrites an existing file',
          'Protected images (by name pattern or recent change) are never moved',
          'Every verdict carries a confidence score and a plain-English reason',
          'Website files are always scanned, so a real reference is never missed',
          'A hosting provider’s orphan list is cross-checked, and any image the app finds in use is flagged',
        ],
        ai: 'None. It is pure, explainable code, so every “unused” verdict comes with a reason you can check.',
        tech: ['Python 3.11', 'Standard library only', 'About 4,700 lines, 13 modules', 'Threaded scan and parse', 'PyInstaller .exe'],
        stats: [['0', 'files auto-deleted'], ['50,000+', 'images it is built for'], ['14', 'reference extractors'], ['7', 'CSV reports']],
      },
    },
  };
})();
