# Third-Party Notices

This package bundles or adapts content from the following third-party sources. Full license texts for vendored content are available in the `vendor/` directory.

---

## 1. BMad-Method (MIT)

**Copyright:** © 2025 BMad Code, LLC

**Source repository:** https://github.com/bmad-code-org/BMAD-METHOD

**License:** MIT License. Full license text: `vendor/bmad/LICENSE`

**Summary of MIT terms:** Permission is granted, free of charge, to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, provided that the copyright notice and permission notice appear in all copies or substantial portions.

**Adapted content in agentic-pm-kit v1:**

The following skill categories in `agentic-pm-kit` adapt brainstorming strategies, templates, and facilitation patterns from BMad-Method under the MIT license:

- Brainstorming strategy skills (20-skill curated set)
- Product Brief skill
- PRD (Product Requirements Document) skill
- Epics and Stories skill
- Sprint Planning skill
- Sprint Review skill
- Retrospective skill
- Dev Story skill (optional, for teams with a code component)

Each adapted skill file includes a header line of the form:
`> Adapted from bmad-method:<original-skill-name> (MIT, © 2025 BMad Code, LLC). See THIRD_PARTY_NOTICES.md.`

**Trademark notice:** "BMad", "BMad Method", and "BMad Core" are trademarks of BMad Code, LLC (per `TRADEMARK.md` in the BMad repository). The MIT license covers source code and content; it does not grant trademark rights. References to BMad-Method in this package are for compatibility attribution only, consistent with BMad's published trademark policy. The package name `agentic-pm-kit` contains no BMad trademark.

---

## 2. Scrum Guide 2020 (CC BY-SA 4.0)

**Authors:** Ken Schwaber and Jeff Sutherland

**Source URL:** https://scrumguides.org/scrum-guide.html

**License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
https://creativecommons.org/licenses/by-sa/4.0/legalcode

**Bundled versions:**

- English: `vendor/pm-kit/scrum-guide-en.md`
- Latin American Spanish: `vendor/pm-kit/scrum-guide-es.md` (see note below)

**CC BY-SA 4.0 attribution requirements met by this package:**

1. The author credit (Ken Schwaber and Jeff Sutherland) appears at the top of each bundled file.
2. The source URL and license are stated in the attribution block at the top of each bundled file.
3. The files are provided under the same CC BY-SA 4.0 license terms; downstream distributors of this package who redistribute the bundled Scrum Guide must maintain these same terms.
4. No modifications have been made to the substantive content of the Scrum Guide. The English version is a clean-text Markdown conversion of the HTML source. Formatting differences (HTML-to-Markdown) do not alter meaning.

**Note on the Latin American Spanish version:** The official Latin American Spanish Scrum Guide 2020 is published by scrumguides.org in PDF format only (translated by Lucho Salazar and Marcelo Lopez). The bundled `vendor/pm-kit/scrum-guide-es.md` file is currently a placeholder pending manual PDF-to-Markdown conversion before it is production-ready. See the follow-up note inside that file. The canonical PDF URL is: https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Spanish-Latin-South-American.pdf

---

## 3. Agile Manifesto (© 2001)

**Authors:** Kent Beck, Mike Beedle, Arie van Bennekum, Alistair Cockburn, Ward Cunningham, Martin Fowler, James Grenning, Jim Highsmith, Andrew Hunt, Ron Jeffries, Jon Kern, Brian Marick, Robert C. Martin, Steve Mellor, Ken Schwaber, Jeff Sutherland, Dave Thomas

**Source URLs:** https://agilemanifesto.org/ and https://agilemanifesto.org/principles.html

**Copyright notice:** © 2001, the above authors.

**Reproduction terms:** "This declaration may be freely copied in any form, but only in its entirety through this notice."

**Bundled at:** `vendor/pm-kit/agile-manifesto.md`

The bundled file contains the complete Manifesto text — the four values, all twelve principles, the full signatories list, and the original copyright notice — reproduced in its entirety, satisfying the Manifesto's own reproduction requirement.
