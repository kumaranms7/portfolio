/* ------------------------------------------------------------------
   The resume: ONE source of truth.
   - The Resume page on the site is drawn from this (render.js, renderResume).
   - The PDF (site/assets/Kumaran_M_S_Resume.pdf, the floating Download button) is built from this too:
         node tools/make-resume.mjs
   Edit the words here, run that command, and the page and the PDF stay identical.
   Facts follow the corrected list: Senior Software Engineer from Feb 2024, 50+ projects delivered, 100+ sites supported,
   Best Employee Award 2023, eight tools. No client names, no employer brand on products.
------------------------------------------------------------------- */
(function () {
  'use strict';
  var AQ = (window.AQ = window.AQ || {});
  AQ.content = AQ.content || {};
  AQ.content.resume = {
  "file": "assets/Kumaran_M_S_Resume.pdf",
  "portfolio": "https://kumaranms7.github.io/portfolio/",
  "titles": {
    "summary": "PROFESSIONAL SUMMARY",
    "highlights": "CAREER HIGHLIGHTS",
    "skills": "CORE TECHNICAL SKILLS",
    "experience": "PROFESSIONAL EXPERIENCE",
    "featured": "FEATURED AI & AUTOMATION PROJECTS",
    "wp": "SELECTED WORDPRESS & PHP PROJECTS",
    "recognition": "RECOGNITION, CERTIFICATIONS & EDUCATION"
  },
  "headline": "SENIOR SOFTWARE ENGINEER (WORDPRESS & PHP) | AI AUTOMATION ENGINEER",
  "summary": "Senior Software Engineer with 7+ years of PHP, WordPress, WooCommerce and Laravel delivery for international clients (50+ projects delivered, 100+ production sites supported), now also building applied-AI automation. Since 2025 has designed and shipped eight tools with Claude Code and the Claude API, including GAds Dashboard, built solo in about 6 weeks, which cut Google Ads reporting from 1-2 hours to under 1 minute. Owns work end to end (requirements, estimates, architecture, build, release, servers and production support) with Core Web Vitals and technical SEO built in, and puts validation, previews and rollback around every AI feature. Open to remote Senior WordPress/PHP Engineer and AI Automation Engineer roles.",
  "highlights": [
    "7+ years of delivery: 50+ projects delivered, 100+ production sites supported, 30+ sites tuned for Core Web Vitals (90+ mobile scores on several).",
    "8 tools built with Claude Code since 2025 (3 products, 5 utilities): Google Ads reporting from 1-2 hours to under 1 minute, average SEO score 75 to 90+, client SEO reports in about 5 minutes instead of 1-2 hours.",
    "Guardrails by design around every AI feature: dry runs, validate-only checks, backups, rollback and score-protected writes.",
    "Best Employee Award (2023); Claude Code in Action and AI Fluency certifications from Anthropic."
  ],
  "skills": [
    [
      "AI & Automation",
      "Claude API, Claude Code, prompt engineering, structured (JSON-schema) output, LLM output validation, workflow automation, Python, Electron, Cursor, GitHub Copilot, Gemini"
    ],
    [
      "WordPress / PHP",
      "PHP, WordPress (custom themes and plugins, Multisite), WooCommerce and Subscriptions, ACF, Gravity Forms, Laravel"
    ],
    [
      "Backend / Integrations",
      "MySQL, REST APIs, AJAX, cron jobs, Google Ads API, Stripe, PayPal, Paytm, CCAvenue, UPS Shipping, third-party services"
    ],
    [
      "Frontend",
      "JavaScript, jQuery, HTML5, CSS3, Bootstrap, Tailwind CSS, responsive development; React.js and Angular (learning)"
    ],
    [
      "SEO / Performance",
      "Core Web Vitals, PageSpeed, GA4, GTM, Search Console, schema, IndexNow, technical SEO"
    ],
    [
      "Engineering / Delivery",
      "Full SDLC, requirements and estimation, code review, mentoring, Git and GitHub, Postman, deployments, server management, production support"
    ]
  ],
  "jobs": [
    {
      "title": "Senior Software Engineer",
      "meta": "CG-VAK Software & Exports Ltd. | Feb 2024 - Present",
      "bullets": [
        "Own delivery of PHP, WordPress, WooCommerce and Laravel projects for international clients, from requirements and estimates through build, release and production support; support 100+ production sites.",
        "Since 2025, design and build internal AI automation products with Claude Code, the Claude API, Python and Electron alongside client delivery (see Featured Projects).",
        "Optimize sites for Core Web Vitals and PageSpeed (30+ sites, 90+ mobile scores on several) and set up GA4, GTM, Search Console, schema, Bing Webmaster and IndexNow.",
        "Review code, mentor junior developers, manage production deployments and server issues, and work directly with clients.",
        "Ran Google Ads campaigns for 5 client accounts, work that shaped the Google Ads tooling. Best Employee Award, 2023."
      ]
    },
    {
      "title": "Software Engineer",
      "meta": "CG-VAK Software & Exports Ltd. | Mar 2022 - Jan 2024",
      "bullets": [
        "Built custom WordPress themes, plugins and PHP applications to international client specifications, with responsive front ends (HTML5, CSS3, JavaScript, Bootstrap).",
        "Integrated third-party REST APIs, improved Core Web Vitals, speed and technical SEO, and managed production deployments, server maintenance and post-launch support."
      ]
    },
    {
      "title": "Software Developer",
      "meta": "Galaxy Weblinks Inc. | May 2019 - Feb 2022 | promoted from Associate Software Developer",
      "bullets": [
        "Built WordPress and PHP e-commerce, learning, news and catalog sites with custom themes, plugins and business logic.",
        "Implemented PayPal, Paytm, CCAvenue, UPS Shipping, Google Maps and Infusionsoft CRM integrations; handled requirements, debugging, staging and production deployment, and maintenance."
      ]
    },
    {
      "title": "Associate / QA & QC",
      "meta": "SBL Knowledge Services | Nov 2017 - Apr 2019 | promoted from Data Entry Operator",
      "bullets": [
        "Audited high-volume datasets for accuracy, traced discrepancies to their root cause and improved QA workflows."
      ]
    }
  ],
  "featuredIntro": "Eight tools (three full products and five utilities) built with Claude Code for a digital-marketing agency’s daily work; four of them call Claude inside. Details and demos: ",
  "featured": [
    {
      "name": "GAds Dashboard",
      "tech": "Electron, React, Google Ads API, Claude API, Vitest",
      "bullets": [
        "Built solo in about 6 weeks: a Windows app to audit, report on and edit many Google Ads accounts. Claude answers questions from live data and drafts ads, but a person always publishes (validate-only check, live-change confirmation, change log with rollback).",
        "AI copy is length-checked, rewritten up to 3 times or swapped for a safe fallback; the chat assistant has 9 read-only tools and cannot write. 62 automated tests.",
        "Cut Google Ads reporting from 1-2 hours to under 1 minute and manual optimization effort by 85-95%."
      ]
    },
    {
      "name": "Site Modernizer",
      "tech": "Node.js, Express, Electron, Tailwind CSS, Claude API",
      "bullets": [
        "Rebuilds client sites in one of 14 hand-coded designs and proves by code that no title, meta tag, link, phone number, form or tracking ID was lost. Failed pages keep their original file.",
        "Optional WebP image conversion and AI copy under about 30 rule checks; a 43-point launch checklist, real-browser tests (phone, slow 4G), a verified backup before apply, and deploy and rollback packages. About 315 automated tests."
      ]
    },
    {
      "name": "Form and Lead Platform",
      "tech": "PHP 8.1, MySQL, vanilla JavaScript",
      "bullets": [
        "Self-hosted form builder and lead inbox: one login for many client sites, 23 field types, real-HTML embeds, 9-layer spam defence, 2FA, signed webhooks, a retrying queue and a monthly lead report.",
        "Security built in: hashed passwords with lockout, CSRF tokens, prepared statements, per-site isolation, upload scanning (optional ClamAV), HMAC-signed webhooks."
      ]
    },
    {
      "name": "Five SEO and site utilities",
      "tech": "Python, Claude API, Tkinter, PyInstaller",
      "bullets": [
        "Page Content Enhancer: Claude rewrites only visible text, never HTML or PHP; pages scored 0-100 before and after (average 75 to 90+), validated on 1,000+ page sites.",
        "Meta Tag Updater: unique titles, descriptions, H1s, schema and share tags with dry run, backup and score-protected writes (about 90% less manual effort).",
        "Canonical Injector: redirect-aware canonical tags, live on 30+ client sites. SEO Report Automation: client reports in about 5 minutes instead of 1-2 hours (7 client projects; no AI, every number computed).",
        "Image Cleaner: finds unused images across 14 reference types, never deletes, restorable backup, built for 50,000+ images."
      ]
    }
  ],
  "wp": [
    [
      "iScrap App",
      "scrap-metal price tracking and paid subscriptions (WooCommerce Subscriptions, Stripe, ACF, Gravity Forms): average-price and 30-day price-change logic, JavaScript charts and CAD-to-USD conversion."
    ],
    [
      "E-commerce & Partner Store Platform",
      "a four-site WooCommerce solution (custom theme, UPS Shipping, PayPal, Google Maps): shipping cost and tracking, nearest-store search from the visitor’s location and a partner back end."
    ],
    [
      "Learning Management System",
      "LearnDash, WooCommerce, Gravity Forms, bbPress, Elementor, PayPal and Google Cloud: student activity tracking, dashboards and staged releases."
    ],
    [
      "WordPress Multisite School Platform",
      "several school-branch sites in one Multisite install, with event registration and Paytm payments."
    ]
  ],
  "recognition": [
    "Best Employee Award, CG-VAK Software & Exports Ltd. (2023)",
    "Claude Code in Action, Anthropic (certification); AI Fluency: Framework & Foundations, Anthropic (Certificate of Completion, Sep 2026)",
    "B.Sc. Mathematics, Sourashtra College, Madurai (2017). Languages: Tamil (native), English (professional working proficiency)"
  ]
};
})();
