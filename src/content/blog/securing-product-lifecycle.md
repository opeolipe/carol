---
title: "Why PMs Should Threat Model"
date: 2026-05-19
description: "Moving security from a technical checkbox to a core strategic advantage in high-trust markets."
tags: ["Product Management", "Cybersecurity", "Strategy"]
---

Product Managers often view security as a roadblock—something that slows down velocity and adds friction to the user experience. But in an era of increasing data breaches and heightened user awareness, security is no longer just a technical requirement.

It is a **competitive advantage**.

## Beyond the Checklist

Most PMs treat security as a "checkbox" at the end of the development cycle. They finish the feature, then ask the security team to "bless it." This approach is fundamentally flawed. 

When security is bolted on at the last minute, it inevitably creates:
- **UX Friction:** Sudden MFA prompts or complex password requirements that feel foreign to the app.
- **Development Delays:** Finding a critical vulnerability right before launch usually means weeks of refactoring.
- **Strategic Blindness:** Missing the fact that a feature's data collection might violate emerging privacy laws like Indonesia's PDP.

## Shifting Left

"Shifting Left" in product management means bringing security considerations into the **Ideation** and **Discovery** phases.

Instead of asking "Can we build this?", ask "How could this be abused?". 

At Mekari, we've started implementing **Abuse Cases** alongside User Stories. If a user story is *"As a user, I want to export my data to CSV,"* an abuse case is *"As an attacker, I want to trigger a bulk export to exfiltrate company data via an unauthorized API call."*

## The Privacy UX

Good security doesn't have to be visible, but good privacy *should* be. 

Transparency builds trust. When you explain *why* you need a specific permission or *how* you encrypt data, you aren't just being compliant—you're telling the user that you respect them.

## Conclusion

The future of product is secure. PMs who embrace this transition will find themselves not only building safer products but building deeper, more resilient relationships with their customers.
