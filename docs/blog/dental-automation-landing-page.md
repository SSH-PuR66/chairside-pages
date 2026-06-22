---
title: "FlowForge: How I Designed a Conversion-Focused Landing Page for a Niche SaaS (Dental Automation)"
published: false
description: "An ROI calculator, workflow template previews, and a lead capture funnel — built with vanilla JS and deployed on GitHub Pages. Here's the design strategy."
tags: webdev, javascript, saas, design
cover_image: ""
canonical_url:
---

Most developer portfolios show tools built for developers. I wanted to build something for a completely different market — dental practices — to prove I can translate business requirements into software, not just code for other coders.

**FlowForge** is a landing page for a dental automation service. It's designed to do one thing: convince a dental office manager that automating their admin work is worth paying for. And it uses an ROI calculator as the primary conversion tool.

---

## The conversion strategy

The page follows a specific flow:

1. **Hero** — "We automate your dental practice's busywork" (clear value prop)
2. **ROI Calculator** — input hours spent on admin tasks, see dollar savings
3. **Workflow Templates** — preview the actual automations (patient intake, appointment reminders, invoice sync)
4. **Pricing** — three tiers with "Start Free" CTAs
5. **FAQ** — overcome objections
6. **Contact Capture** — Formspree-backed form

The ROI calculator is the linchpin. A dental office manager doesn't care about "automation" in the abstract. They care about "how much money am I wasting on admin work right now." The calculator makes that concrete.

---

## The ROI calculator

```javascript
// roi.js — isolated, testable
function calculateROI(hoursPerWeek, hourlyRate) {
    const weeklyCost = hoursPerWeek * hourlyRate;
    const monthlyCost = weeklyCost * 4.33;
    const annualCost = monthlyCost * 12;
    const savingsRate = 0.7; // FlowForge automates ~70% of admin tasks
    return {
        monthlySavings: monthlyCost * savingsRate,
        annualSavings: annualCost * savingsRate,
        monthlyWaste: monthlyCost,
    };
}
```

The user drags a slider ("How many hours per week do you spend on admin?"), enters their hourly rate, and gets a savings number. The animated counter makes it feel real — watching "$2,400/month" count up from zero is more compelling than a static number.

The `savingsRate` of 0.7 is conservative enough to be believable. Claiming 100% would feel like BS. 70% says "we handle most of it but some things still need a human." That's honest and it builds trust.

---

## Workflow template previews

Instead of generic feature descriptions, FlowForge shows the actual automation workflows as JSON templates:

```json
// templates/dental/new-patient-intake.json
{
  "name": "New Patient Intake",
  "trigger": "new_patient_form_submitted",
  "steps": [
    { "action": "validate_insurance", "timeout": "5m" },
    { "action": "create_patient_record", "system": "dentrix" },
    { "action": "send_welcome_email", "template": "new_patient" },
    { "action": "schedule_first_appointment", "window": "7d" }
  ]
}
```

Three templates ship with the site: new patient intake, appointment reminders, and invoice syncing. Each opens in a modal preview when you click the workflow card.

This does two things: (1) it shows the prospect exactly what they're getting, and (2) it signals technical credibility — you're not just talking about automation, you're showing the actual workflow definition.

---

## Tech stack choices

| Choice | Why |
|---|---|
| **Vanilla JS** | No build step, instant deploy, fast load |
| **No framework** | A landing page doesn't need React |
| **Vitest** | ROI logic has unit tests — the one piece of business logic that *must* be correct |
| **Formspree** | Contact form backend without writing a server |
| **GitHub Pages** | Free hosting, automatic deploys from git push |

The ROI calculator is the only JavaScript that has actual business logic. Everything else is DOM manipulation for animations and modals. Testing the ROI math means the one number that matters to the prospect is always correct.

---

## Why this works as a portfolio piece

1. **It shows business thinking.** I didn't just build a website — I designed a conversion funnel with a specific user (dental office manager) in mind.
2. **It targets a niche.** "I built a dental automation landing page" is more memorable in an interview than "I built a SaaS landing page."
3. **The ROI calculator is testable.** I can show a hiring manager that the business logic has unit tests.
4. **It's deployed and live.** [ssh-pur66.github.io/FlowForge](https://ssh-pur66.github.io/FlowForge/) — you can see it work.

---

## Note on Atom-Agexx

There's a second version of this concept in the [Atom-Agexx](https://github.com/SSH-PuR66/Atom-Agexx) repo — same dental automation idea, different design iteration, deployed on Cloudflare Pages instead of GitHub Pages. Having two iterations shows design evolution and platform flexibility.

---

*Source: [github.com/SSH-PuR66/FlowForge](https://github.com/SSH-PuR66/FlowForge) | [Atom-Agexx variant](https://github.com/SSH-PuR66/Atom-Agexx)*
