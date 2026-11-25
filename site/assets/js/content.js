/* ------------------------------------------------------------------
   Single source of truth for the portfolio's text.
   Edit facts here, not in the HTML or the other scripts.
   Every number below comes from Kumaran's confirmed answers, his
   resumes or his own timesheets. Product names are generic.
------------------------------------------------------------------- */
(function () {
  'use strict';
  var AQ = (window.AQ = window.AQ || {});

  var EMAIL = 'mallisrikumaran@gmail.com';

  function mailto(subject, body) {
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  AQ.content = {
    person: {
      name: 'Kumaran M S',
      email: EMAIL,
      phoneDisplay: '+91 96983 43157',
      phoneTel: '+919698343157',
      linkedin: 'https://www.linkedin.com/in/kumaran-m-s-381611145/',
      place: 'Madurai, Tamil Nadu, India',
    },

    mail: {
      hiring: mailto(
        'Role enquiry: AI Automation Engineer',
        'Hi Kumaran,\n\nI found your portfolio and would like to talk about a role.\n\nCompany:\nRole:\nRemote or location:\nBest time to talk:\n\nThanks,\n'
      ),
      project: mailto(
        'Project enquiry',
        'Hi Kumaran,\n\nI would like help with a project.\n\nWhat I need (website, WordPress, AI automation):\nTimeline:\nBudget range:\n\nThanks,\n'
      ),
    },

    /* ---- Hero banner -------------------------------------------------
       To add your animated clip: put the file(s) in site/assets/video/ and list them here.
       Put the WebM first (smaller), the MP4 second (works everywhere), for example:
         video: ['assets/video/hero.webm', 'assets/video/hero.mp4']
       mode 'backdrop': the clip fills the banner behind the name; your photo stays on the right.
       mode 'portrait': the clip replaces the photo on the right.
       Leave video empty to show the photo only. */
    hero: {
      video: ['assets/video/hero.webm', 'assets/video/hero.mp4'],
      mode: 'portrait',
      /* The glass chips floating around your photo. pos: left | right | br (bottom right).
         k is the big line, v the small line under it. */
      chips: [
        { pos: 'left', k: '7+ years', v: 'PHP · WordPress · AI' },
        { pos: 'right', k: 'Best Employee', v: 'CG-VAK · 2023' },
        { pos: 'br', k: 'Under 1 minute', v: 'Google Ads reports' },
      ],
    },

    /* The short loop that plays on the End credits poster (loads only when you scroll near it).
       Files live in site/assets/video/. Set to [] to show the still picture only. */
    posterVideo: ['assets/video/credits.webm', 'assets/video/credits.mp4'],

    /* How wild the scroll animations are.
       'wild' = everything: letter-by-letter titles, sliding giant words between sections, 3D card flips, spinning icons,
                floating rings, the hero zooming and flinging its chips away.
       'calm' = only the fade-and-slide reveals.
       (Visitors who prefer reduced motion always get none of it.) */
    fx: 'wild',

    /* The three product demo videos in the popups. Off until you have checked what is on screen in them (employer logo,
       account names, a real client). The files stay out of git (.gitignore) while this is false. */
    demoVideos: false,

    /* The giant words that slide sideways between sections (only in 'wild'). One list per band. */
    marquee: [
      ['AI automation', 'Claude Code', 'WordPress', 'PHP', 'Google Ads', 'Technical SEO'],
      ['7+ years', '50+ projects', '100+ sites', '8 AI tools'],
      ['Remote ready', 'Madurai', 'Open to work'],
    ],

    /* Text on the intro screen that opens the site */
    intro: {
      role: 'AI automation engineer',
      position: 'Senior Software Engineer · CG-VAK Software & Exports',
      place: 'Madurai, India',
      whoNote: 'Every profile sees the same story of Kumaran M S. It only changes what plays first.',
    },

    /* Background pictures for the cards (Continue exploring, My journey seasons, Trophies).
       Put WebP files in site/assets/img/cards/ named like this:
         Continue exploring: about, story, lab, method, skills, trophies, core, websites, resume, contact
         Journey seasons:    season-1 ... season-5
         Trophies:           trophy-1 ... trophy-7
       List the ones you have in `have` (for example ['about', 'season-1']), or use 'all' when every file is there.
       The coloured overlay stays on top of each picture; a card with no picture keeps its plain colour. */
    images: {
      base: 'assets/img/cards/',
      have: ['about', 'story', 'lab', 'method', 'skills', 'trophies', 'core', 'websites', 'resume', 'contact',
        'season-1', 'season-2', 'season-3', 'season-4', 'season-5',
        'trophy-1', 'trophy-2', 'trophy-3', 'trophy-4', 'trophy-5', 'trophy-6', 'trophy-7',
        'app-gads', 'app-modernizer', 'app-forms'],   // add 'craft' here once cards/craft.webp exists
    },

    /* About section */
    about: {
      quote: 'I started by typing data by hand. Seven years of building websites later, I build the tools that do that work for me.',
      by: 'Kumaran M S',
      facts: [
        ['Now', 'Senior Software Engineer', 'CG-VAK Software & Exports Ltd.'],
        ['Focus', 'AI automation', 'Claude Code and the Claude API'],
        ['Based in', 'Madurai, India', 'Works remote'],
        ['Languages', 'Tamil, English', ''],
        ['Education', 'B.Sc. Mathematics', 'Sourashtra College, Madurai, 2017'],
        ['Open to', 'Remote AI roles', 'Also WordPress and PHP builds'],
      ],
      stats: [['7+', 'years engineering'], ['50+', 'projects delivered'], ['100+', 'sites supported'], ['8', 'AI tools built']],
    },

    /* Heading text of each section on the home page */
    blocks: {
      about: { eyebrow: 'The pilot', title: 'About me', sub: '' },
      craft: { eyebrow: 'Five crafts', title: 'What I do', sub: 'Software, design, SEO, AI-assisted builds and servers. Pick a craft and watch it work.' },
      story: { eyebrow: 'Original series · 5 seasons', title: 'My journey', sub: 'From data entry to AI tools. Each season lists what happened and the skills I picked up along the way.' },
      lab: { eyebrow: 'Now streaming · 8 tools', title: 'AI Lab', sub: 'Three full products and five utilities, built with Claude Code for a digital-marketing agency’s daily work. Each card says what the app is and why it exists. Open one to see how it works, what keeps it safe and where AI is (and is not) used.' },
      method: { eyebrow: 'Six rules', title: 'How I build with AI', sub: 'The habits that make AI output safe to publish.' },
      skills: { eyebrow: '38 skills · 2 in training', title: 'Skill universe', sub: 'What I work with, grouped by where I picked it up.' },
      trophies: { eyebrow: 'Awards and milestones', title: 'Trophy room', sub: 'Eight trophies on the shelf, from a first promotion to the Best Employee Award.' },
      core: { eyebrow: 'Top five', title: 'My core five', sub: '' },
      websites: { eyebrow: 'Client names left out', title: 'Websites I’ve built', sub: 'Open a title for the stack behind it.' },
      contact: { eyebrow: 'Next episode', title: 'End credits', sub: '' },
    },

    /* The five stops on the career path. */
    journey: [
      {
        id: 'sbl', short: 'Data entry → QA/QC', orgShort: 'SBL Knowledge Services', tier: 'bronze', label3d: ['2017 – 2019', 'Data Desk'],
        zone: 'Data Desk',
        years: '2017 – 2019',
        dates: 'Nov 2017 – Apr 2019',
        org: 'SBL Knowledge Services',
        role: 'Data entry, then QA/QC',
        headline: 'Learned accuracy by checking other people’s data.',
        summary:
          'Started by entering business data by hand. After consistent accuracy, moved to QA/QC to audit what the production team entered.',
        bullets: [
          'Audited high-volume datasets against quality standards',
          'Found discrepancies and traced each one to its cause',
          'Improved QA steps and cut recurring data errors',
        ],
        hardest: 'Large volumes of data where one wrong digit matters.',
        projects: [],
        recognition: 'Promoted from data entry to QA/QC',
        toast: 'Promoted from data entry to QA/QC',
      },
      {
        id: 'galaxy', short: 'Developer', orgShort: 'Galaxy Weblinks', tier: 'bronze', label3d: ['2019 – 2022', 'Workshop'],
        zone: 'Workshop',
        years: '2019 – 2022',
        dates: 'May 2019 – Feb 2022',
        org: 'Galaxy Weblinks Inc.',
        role: 'Associate Software Developer, then Software Developer',
        headline: 'Learned to ship custom WordPress and PHP for international clients.',
        summary:
          'Built themes, plugins and backend features for e-commerce, learning, news and catalogue sites, and wired in payments, shipping and CRM services.',
        bullets: [
          'Custom themes, plugins and backend logic in PHP, WordPress and WooCommerce',
          'PayPal, Paytm, CCAvenue, UPS, Google Maps and Infusionsoft integrations',
          'Staging and production releases, maintenance and performance fixes',
        ],
        hardest: 'Moving money and shipping data correctly across several third-party services.',
        projects: [
          'E-commerce store with partner sites: UPS shipping, PayPal, and nearest-store search from the visitor’s location',
          'Learning platform on LearnDash and WooCommerce with student activity tracking',
          'Multisite school platform with event registration and Paytm payments',
        ],
        recognition: 'Promoted to Software Developer',
        toast: 'Promoted to Software Developer',
      },
      {
        id: 'cgvak-se', short: 'Software Engineer', orgShort: 'CG-VAK Software & Exports', tier: 'gold', label3d: ['2022 – 2024', 'Command Deck'],
        zone: 'Command Deck',
        years: '2022 – 2024',
        dates: 'Mar 2022 – Jan 2024',
        org: 'CG-VAK Software & Exports Ltd.',
        role: 'Software Engineer',
        headline: 'Took ownership of client sites, from build to production.',
        summary:
          'Built custom WordPress and PHP applications for international clients and owned their releases, servers and speed.',
        bullets: [
          'Custom WordPress themes, plugins and PHP applications to client specifications',
          'REST API integrations, responsive interfaces and Core Web Vitals fixes',
          'Production deployments, server upkeep and post-launch troubleshooting',
        ],
        hardest: 'Keeping many client sites fast and stable at once.',
        projects: [
          'Scrap-price tracking and subscription platform: price averages, 30-day change logic, WooCommerce Subscriptions with Stripe',
        ],
        recognition: 'Best Employee Award, 2023',
        toast: 'Best Employee Award, 2023',
      },
      {
        id: 'cgvak-sr', short: 'Senior Engineer', orgShort: 'CG-VAK Software & Exports', tier: 'silver', label3d: ['2024 – now', 'Senior Engineer'],
        zone: 'Command Deck',
        years: '2024 – now',
        dates: 'Feb 2024 – present',
        org: 'CG-VAK Software & Exports Ltd.',
        role: 'Senior Software Engineer',
        headline: 'Became the technical contact for the clients.',
        summary:
          'Leads requirements, estimates, architecture and production support for international clients, and reviews and mentors the developers around the work.',
        bullets: [
          'Technical contact for up to 10 clients at a time',
          'Code review and mentoring for up to 5 junior developers',
          'PageSpeed and Core Web Vitals work on 30+ sites, with 90+ mobile scores on several',
          'GA4, Tag Manager, Search Console, schema and IndexNow set-ups',
          'Ran Google Ads campaigns for 5 client accounts, which shaped the AI tools',
        ],
        hardest: 'Answering for deadlines, quality and uptime on many projects without a middle layer.',
        projects: [],
        recognition: 'Promoted to Senior Software Engineer, Feb 2024',
        toast: 'Promoted to Senior Software Engineer, Feb 2024',
      },
      {
        id: 'ai', short: 'AI automation', orgShort: 'CG-VAK · AI Lab', tier: 'silver', label3d: ['2025 – now', 'AI Lab'],
        zone: 'AI Lab',
        years: '2025 – now',
        dates: 'Jul 2025 – present',
        org: 'CG-VAK Software & Exports Ltd.',
        role: 'AI automation engineer',
        headline: 'Started turning repeat work into tools.',
        summary:
          'Alongside client delivery, designs and builds desktop tools with Claude Code and the Claude API for a digital-marketing agency’s daily work.',
        bullets: [
          '8 tools: 3 full products and 5 utilities',
          'Google Ads, technical SEO, content and site redesign work now run through them',
          'Built with Claude Code, then reviewed, tested and shipped by me',
        ],
        hardest: 'Making AI output safe to publish: previews, backups, checks and rollback in every tool.',
        projects: [],
        recognition: 'Claude Code in Action, Anthropic',
        toast: 'Eight AI tools unlocked. Entering the AI Lab.',
      },
    ],

    /* Skills unlock as the player passes each stop (unlock = stop index). */
    skills: [
      { group: 'Quality', unlock: 0, items: ['QA/QC', 'Data accuracy', 'Root-cause analysis', 'Documentation'] },
      {
        group: 'Web build',
        unlock: 1,
        items: ['PHP', 'WordPress', 'WooCommerce', 'MySQL', 'JavaScript', 'jQuery', 'HTML5 / CSS3', 'Bootstrap', 'ACF', 'Payment and shipping APIs'],
      },
      { group: 'Engineering', unlock: 2, items: ['Laravel', 'REST APIs', 'Tailwind CSS', 'Git / GitHub', 'Postman', 'Core Web Vitals', 'Deployments'] },
      {
        group: 'Delivery',
        unlock: 3,
        items: ['GA4 / GTM / Search Console', 'Schema and IndexNow', 'Google Ads management', 'Technical SEO', 'Code review', 'Mentoring', 'Estimation', 'Server management'],
      },
      {
        group: 'AI automation',
        unlock: 4,
        items: ['Claude API', 'Claude Code', 'Prompt engineering', 'Python', 'Electron', 'Google Ads API', 'Desktop apps', 'LLM cost control', 'Cursor / Copilot / Gemini'],
      },
      { group: 'In training', unlock: 99, items: ['React.js', 'Angular'] },
    ],

    /* The eight AI tools. kind: major | utility */
    tools: [
      { id: 'gads', target: '#gads', kind: 'major', icon: 'i-ads', name: 'GAds Dashboard', line: 'Reports in under 1 minute', art: 'linear-gradient(150deg,#1d4ed8 0%,#0ea5e9 55%,#22d3ee 100%)' },
      { id: 'modernizer', target: '#modernizer', kind: 'major', icon: 'i-site', name: 'Site Modernizer', line: 'Redesigns without losing rankings', art: 'linear-gradient(150deg,#0f766e 0%,#10b981 55%,#a3e635 100%)' },
      { id: 'forms', target: '#forms', kind: 'major', icon: 'i-form', name: 'Form and Lead Platform', line: 'One login, many websites', art: 'linear-gradient(150deg,#c2410c 0%,#f97316 55%,#fbbf24 100%)' },
      { id: 'enhancer', target: '#gadgets', kind: 'utility', icon: 'i-doc', name: 'Page Content Enhancer', line: 'SEO score 75 to 90+' },
      { id: 'meta', target: '#gadgets', kind: 'utility', icon: 'i-tag', name: 'Meta Tag Updater', line: 'About 90% less effort' },
      { id: 'canonical', target: '#gadgets', kind: 'utility', icon: 'i-link', name: 'Canonical Injector', line: 'Live on 30+ sites' },
      { id: 'report', target: '#gadgets', kind: 'utility', icon: 'i-chart', name: 'SEO Report Automation', line: '1–2 hours to about 5 minutes' },
      { id: 'images', target: '#gadgets', kind: 'utility', icon: 'i-image', name: 'Image Cleaner', line: 'Never auto-deletes' },
    ],

    /* The five utilities. Their card and popup words live in apps.js; this keeps the icon, colour and the small before/after visuals. */
    gadgets: [
      { id: 'enhancer', icon: 'i-doc', name: 'Page Content Enhancer', art: 'ember',
        bars: [['Manual', 100, 'about a month'], ['With the tool', 6, 'under a day']] },
      { id: 'meta', icon: 'i-tag', name: 'Meta Tag Updater', art: 'teal',
        bars: [['Manual', 100, 'hours per site'], ['With the tool', 10, 'about a minute per site']] },
      { id: 'canonical', icon: 'i-link', name: 'Canonical Injector', art: 'slate',
        demo: { type: 'code', lines: [['', '<head>'], ['', '  <title>Our services</title>'], ['+', '  <link rel="canonical" href="https://example.com/services/">'], ['', '</head>']] } },
      { id: 'report', icon: 'i-chart', name: 'SEO Report Automation', art: 'amber',
        bars: [['Manual', 100, '1–2 hours'], ['With the tool', 6, 'about 5 minutes']] },
      { id: 'images', icon: 'i-image', name: 'Image Cleaner', art: 'green' },
    ],

    principles: [
      { title: 'Preview before writing', text: 'The meta tool and the canonical tool both run as a dry run first.', tool: 'Meta Tag Updater, Canonical Injector' },
      { title: 'Back up, never delete', text: 'Unused images move to a timestamped backup with a restore manifest.', tool: 'Image Cleaner' },
      { title: 'AI sees text, not markup', text: 'Claude gets flat text units. Tags, scripts and PHP are put back untouched.', tool: 'Page Content Enhancer' },
      { title: 'A page that loses content fails', text: 'Titles, headings, links, phone numbers, forms and tracking IDs are checked against the original.', tool: 'Site Modernizer' },
      { title: 'Pay only for what needs AI', text: 'Pages already scoring 90+ skip the call. Model and effort level are chosen per run.', tool: 'Page Content Enhancer' },
      { title: 'Keys stay on the machine', text: 'API keys and Google Ads credentials are stored locally, never in the code.', tool: 'GAds Dashboard' },
    ],

    achievements: [
      { title: 'Best Employee Award', text: 'CG-VAK Software & Exports Ltd., 2023', tier: 'gold' },
      { title: 'Claude Code in Action', text: 'Certification from Anthropic', tier: 'silver' },
      { title: 'AI Fluency: Framework & Foundations', text: 'Certificate of Completion from Anthropic, Sep 2026', tier: 'silver' },
      { title: 'Three promotions', text: 'Data entry to QA/QC, Developer, then Senior Software Engineer', tier: 'bronze' },
      { title: 'B.Sc. Mathematics', text: 'Sourashtra College, Madurai, 2017', tier: 'bronze' },
    ],

    /* ======================================================
       Streaming-style layout data (profiles, rows, posters)
       ====================================================== */

    /* One colour per season. Names map to the poster gradients in base.css */
    seasonArt: ['slate', 'amber', 'teal', 'ember', 'blue'],

    /* "Who's visiting" profiles. Same story for everyone; the profile only changes what plays first. */
    profiles: [
      {
        id: 'browse', name: 'Kumaran', line: 'The full story, in order', photo: true, badge: 'Main', art: 'ember',
        order: ['about', 'craft', 'story', 'lab', 'method', 'skills', 'trophies', 'core', 'websites'],
        hero: { kicker: 'Open to remote roles', primary: { label: 'Play trailer', act: 'trailer' }, secondary: { label: 'Start the story', href: '#story' } },
      },
      {
        id: 'recruiter', name: 'Recruiter', line: 'Numbers, trophies and skills first', glyph: 'R', icon: 'i-briefcase', art: 'blue',
        order: ['about', 'craft', 'trophies', 'skills', 'story', 'lab', 'method', 'core', 'websites'],
        hero: { kicker: 'Open to remote roles', primary: { label: 'Play trailer', act: 'trailer' }, secondary: { label: 'Open resume', href: '#/resume' } },
      },
      {
        id: 'client', name: 'Client', line: 'Websites and projects first', icon: 'i-spark', art: 'amber',
        order: ['websites', 'craft', 'lab', 'about', 'story', 'trophies', 'core', 'skills', 'method'],
        hero: { kicker: 'Available for projects', primary: { label: 'Start a project', mail: 'project' }, secondary: { label: 'Play trailer', act: 'trailer' } },
      },
      {
        id: 'engineer', name: 'Engineer', line: 'AI tools and how I build first', icon: 'i-code', art: 'green',
        order: ['lab', 'craft', 'method', 'skills', 'core', 'story', 'trophies', 'about', 'websites'],
        hero: { kicker: 'Open to remote roles', primary: { label: 'Open the AI Lab', href: '#lab' }, secondary: { label: 'Play trailer', act: 'trailer' } },
      },
    ],

    /* The "Continue exploring" tiles under the hero. Each one scrolls to its section. */
    sections: {
      about: { href: '#about', title: 'About me', k: 'The pilot', icon: 'i-user', art: 'slate', line: 'Who I am, in numbers' },
      craft: { href: '#craft', title: 'What I do', k: '5 crafts', icon: 'i-spark', art: 'amber', line: 'Code, design, SEO, AI and servers' },
      story: { href: '#story', title: 'My Journey', k: '5 seasons', icon: 'i-story', art: 'ember', line: 'Career path, 2017 to now' },
      lab: { href: '#lab', title: 'AI Lab', k: '8 tools', icon: 'i-lab', art: 'blue', line: 'Three products, five utilities' },
      method: { href: '#method', title: 'How I build', k: 'Six rules', icon: 'i-code', art: 'green', line: 'Making AI output safe' },
      skills: { href: '#skills', title: 'Skill Universe', k: '38 skills', icon: 'i-skills', art: 'teal', line: 'What I work with' },
      trophies: { href: '#trophies', title: 'Trophy Room', k: '8 trophies', icon: 'i-trophy', art: 'amber', line: 'Awards and milestones' },
      core: { href: '#core', title: 'Core Five', k: 'Top five', icon: 'i-check', art: 'blue', line: 'What I am best at' },
      websites: { href: '#websites', title: 'Websites', k: '4 builds', icon: 'i-site', art: 'ember', line: 'Client work, names left out' },
      resume: { href: '#/resume', title: 'Resume', k: 'One page', icon: 'i-doc', art: 'slate', line: 'Printable summary' },
      contact: { href: '#contact', title: 'End Credits', k: 'Say hello', icon: 'i-mail', art: 'green', line: 'Email, phone and LinkedIn' },
    },

    /* The three full products: name, colour and demo video. Their card and popup words live in apps.js. */
    products: {
      gads: {
        name: 'GAds Dashboard', k: 'Product 1 of 3', art: 'blue', icon: 'i-ads',
        video: { src: 'assets/video/demo-gads.mp4', poster: 'assets/img/demo-gads.webp', length: '2:56', note: 'Screen recording. No sound, captions are on screen.' },
      },
      modernizer: {
        name: 'Site Modernizer', k: 'Product 2 of 3', art: 'green', icon: 'i-site',
        video: { src: 'assets/video/demo-modernizer.mp4', poster: 'assets/img/demo-modernizer.webp', length: '3:01', note: 'Screen recording with sound. Captions are on screen.' },
      },
      forms: {
        name: 'Form and Lead Platform', k: 'Product 3 of 3', art: 'amber', icon: 'i-form',
        video: { src: 'assets/video/demo-forms.mp4', poster: 'assets/img/demo-forms.webp', length: '2:31', note: 'Screen recording with sound. Captions are on screen.' },
      },
    },

    /* "What I do": the five crafts. Each one is a panel with its own animated scene (the scenes are drawn in render.js).
       `scene` picks which one: code | design | seo | ai | server. `facts` are [big number, label] pairs. */
    craft: [
      {
        id: 'dev', scene: 'code', icon: 'i-code', art: 'blue', name: 'Software development',
        line: 'Custom PHP and WordPress builds, Laravel apps and REST APIs, taken from the first requirement to production.',
        facts: [['7+', 'years building websites'], ['50+', 'projects delivered']],
        chips: ['PHP', 'WordPress', 'WooCommerce', 'Laravel', 'REST APIs', 'MySQL', 'JavaScript'],
      },
      {
        id: 'design', scene: 'design', icon: 'i-pen', art: 'ember', name: 'Designing',
        line: 'Page layouts and interfaces that hold up on a phone and on a desktop, for client websites and for the dashboards of my own tools.',
        facts: [['14', 'hand-coded designs in Site Modernizer']],
        chips: ['HTML5 / CSS3', 'Bootstrap', 'Tailwind CSS', 'Responsive layouts', 'Dashboards', 'Forms'],
      },
      {
        id: 'seo', scene: 'seo', icon: 'i-chart', art: 'green', name: 'SEO',
        line: 'Technical SEO and speed work: titles, canonicals, schema and Core Web Vitals, measured with GA4 and Search Console.',
        facts: [['75 → 90+', 'average SEO score with my tool'], ['30+', 'sites tuned for Core Web Vitals']],
        chips: ['Core Web Vitals', 'GA4 / GTM', 'Search Console', 'Schema', 'IndexNow', 'Canonical tags', 'Reports'],
      },
      {
        id: 'ai', scene: 'ai', icon: 'i-spark', art: 'teal', name: 'AI-assisted development',
        line: 'I build with Claude Code and the Claude API, then read, test and approve every change myself before it ships.',
        facts: [['8', 'AI tools built and shipped'], ['~6 wks', 'to build GAds Dashboard, solo']],
        chips: ['Claude Code', 'Claude API', 'Prompt engineering', 'Electron', 'Python', 'LLM cost control'],
      },
      {
        id: 'server', scene: 'server', icon: 'i-server', art: 'slate', name: 'Servers and deployments',
        line: 'Server set-ups, releases and day-to-day care, so client sites stay fast and stable and every change has a way back.',
        facts: [['100+', 'sites supported'], ['30+', 'client sites kept fast and stable']],
        chips: ['Server management', 'Deployments', 'Git / GitHub', 'Backups and rollback', 'Speed and uptime'],
      },
    ],

    /* "My core five" row */
    core: [
      { title: 'PHP and WordPress', line: '7 years of custom themes, plugins and WooCommerce', art: 'amber', icon: 'i-code' },
      { title: 'Claude API and Claude Code', line: 'Eight AI tools, built and reviewed by me', art: 'blue', icon: 'i-spark' },
      { title: 'Technical SEO and speed', line: '30+ sites tuned for Core Web Vitals', art: 'green', icon: 'i-chart' },
      { title: 'Google Ads automation', line: 'Ran 5 client accounts, then automated the work', art: 'ember', icon: 'i-ads' },
      { title: 'Full delivery', line: 'Requirements to production: estimates, reviews, servers', art: 'teal', icon: 'i-check' },
    ],

    /* Websites built (client names are left out on purpose) */
    websites: [
      { id: 'store', title: 'Store with partner sites', art: 'ember', icon: 'i-site', k: 'E-commerce', line: 'Four sites: UPS shipping, PayPal and nearest-store search from the visitor’s location.', chips: ['PHP', 'WooCommerce', 'UPS', 'PayPal', 'Google Maps'] },
      { id: 'learning', title: 'Learning platform', art: 'blue', icon: 'i-doc', k: 'E-learning', line: 'LearnDash and WooCommerce with student activity tracking and staged releases.', chips: ['LearnDash', 'WooCommerce', 'PayPal'] },
      { id: 'school', title: 'School network', art: 'green', icon: 'i-form', k: 'Multisite', line: 'One WordPress Multisite install for several school branches, with event registration and Paytm payments.', chips: ['Multisite', 'WPBakery', 'Paytm'] },
      { id: 'tracker', title: 'Scrap-price tracker', art: 'amber', icon: 'i-chart', k: 'Subscriptions', line: 'Price averages, 30-day change logic and paid subscriptions with Stripe.', chips: ['WooCommerce Subscriptions', 'Stripe', 'ACF'] },
    ],

    /* Every trophy in the Trophy Room. `img` is the background picture in assets/img/cards/ ('' = none yet).
       To give the AI Fluency trophy a picture: save it as trophy-8.webp, set img: 'trophy-8' here and add 'trophy-8' to images.have. */
    trophies: [
      { tier: 'gold', title: 'Best Employee Award', text: 'CG-VAK Software & Exports Ltd., 2023', img: 'trophy-1' },
      { tier: 'silver', title: 'Claude Code in Action', text: 'Certification from Anthropic', img: 'trophy-2' },
      { tier: 'silver', title: 'AI Fluency: Framework & Foundations', text: 'Certificate of Completion from Anthropic, Sep 2026', img: '' },
      { tier: 'silver', title: 'Senior Software Engineer', text: 'Promoted at CG-VAK, February 2024', img: 'trophy-3' },
      { tier: 'silver', title: 'Eight AI tools shipped', text: 'Three products and five utilities, 2025 to now', img: 'trophy-4' },
      { tier: 'bronze', title: 'Promoted to QA/QC', text: 'From data entry at SBL Knowledge Services', img: 'trophy-5' },
      { tier: 'bronze', title: 'Promoted to Developer', text: 'At Galaxy Weblinks', img: 'trophy-6' },
      { tier: 'bronze', title: 'B.Sc. Mathematics', text: 'Sourashtra College, Madurai, 2017', img: 'trophy-7' },
    ],

    /* The 30-second trailer: one idea per scene */
    trailer: [
      { big: 'Kumaran M S', small: 'AI automation engineer', style: 'title' },
      { big: 'He started by typing data by hand.', small: 'Data entry, then QA/QC, 2017' },
      { big: '7+ years building websites.', small: '50+ projects delivered. 100+ sites supported.' },
      { big: 'Then he built the tools that do the work.', small: '8 AI tools, built with Claude Code' },
      { big: '1–2 hours → under 1 minute', small: 'Google Ads reporting, with GAds Dashboard', style: 'stat' },
      { big: 'Built solo in about 6 weeks.', small: 'Best Employee Award, 2023' },
      { big: 'Open to remote roles.', small: 'Madurai, India', style: 'end' },
    ],

    /* End credits */
    credits: [
      ['Starring', 'Kumaran M S'],
      ['Role', 'AI automation engineer'],
      ['Based in', 'Madurai, India · works remote'],
      ['Languages', 'Tamil, English'],
      ['Available for', 'Remote AI automation roles'],
      ['Also available for', 'WordPress and PHP builds'],
    ],
  };
})();
