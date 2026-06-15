# User Registration / Signup — Mockup Specification (Activity 1.3)

**Figma mockup:** https://www.figma.com/design/Yiqoh5c9yeg6FRDWKMkXnn/Untitled?node-id=0-1

This is the design spec for the user registration screen. It is implemented in
`frontend/src/pages/Register.jsx`. The Figma mockup above was designed from this spec.

## Wireframe (split-screen layout)

```
┌───────────────────────────────────────────────────────────────────────┐
│                              │                                          │
│   ┌────┐                     │   Create your account                   │
│   │TZW │  (logo mark)        │   Fill in your details to get started    │
│   └────┘                     │                                          │
│                              │   ┌─────────────┐  ┌─────────────┐       │
│   Join the Fire Safety       │   │ First Name  │  │ Last Name   │       │
│   Management Platform        │   │ [ John    ] │  │ [ Doe     ] │       │
│                              │   └─────────────┘  └─────────────┘       │
│   Create an account to       │   ┌──────────────────────────────────┐  │
│   start scheduling           │   │ Email Address                    │  │
│   inspections, logging       │   │ [ you@company.com              ] │  │
│   maintenance, and keeping   │   └──────────────────────────────────┘  │
│   every extinguisher         │   ┌──────────────────────────────────┐  │
│   compliant.                 │   │ Password                         │  │
│                              │   │ [ At least 6 characters        ] │  │
│   • Quick setup              │   └──────────────────────────────────┘  │
│   • Secure JWT auth          │   ┌──────────────────────────────────┐  │
│   • Admins, Inspectors &     │   │ Account Type      [ User      ▼] │  │
│     Users                    │   └──────────────────────────────────┘  │
│                              │   ┌──────────────────────────────────┐  │
│   (warm red/orange          │   │        Create account            │  │  ← primary button
│    gradient panel)           │   └──────────────────────────────────┘  │
│                              │                                          │
│                              │   Already have an account? Sign in       │
└───────────────────────────────────────────────────────────────────────┘
        LEFT: brand panel              RIGHT: form panel (white)
```

## Layout
- **Two-column split**, 50/50 on desktop; stacks to single column on mobile (< 768px,
  brand panel hidden or collapsed to a header).
- **Left panel:** brand/marketing, warm gradient background, white text.
- **Right panel:** white background, centered form, max-width ~420px.

## Color palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary / accent | `#ef6c4d` | Buttons, links, logo |
| Primary text | `#1f2a27` | Headings |
| Muted text | `#6e7975` | Sub-labels, helper text |
| Error bg / text | `#fdecea` / `#b3361e` | Validation errors |
| Field border | `#d9e0dd` | Inputs |

## Typography
- Headings: 24–28px, weight 700.
- Labels: 13–14px, weight 600.
- Body / helper: 14px, weight 400.

## Form fields (validation)
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| First Name | text | yes | non-empty |
| Last Name | text | yes | non-empty |
| Email | email | yes | valid email format, unique |
| Password | password | yes | min 6 characters |
| Account Type | select | yes | one of: User, Inspector, Admin (default User) |

## States
- **Default** — empty fields with placeholders.
- **Focused** — input border highlights to accent color.
- **Error** — red alert banner above the form (e.g. "Email already registered").
- **Loading** — button text changes to "Creating account…" and is disabled.
- **Success** — redirect to `/dashboard` (user is auto-logged-in via returned JWT).

## Components
- **Primary button:** full-width, accent background, white text, 8px radius.
- **Inputs:** full-width, 1px border, 8px radius, 12px padding.
- **Footer link:** centered, "Already have an account? **Sign in**" → `/login`.
```
