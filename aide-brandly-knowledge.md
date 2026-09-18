# Brandly — Product Knowledge Base

## What is Brandly?
Brandly is an AI-based brand–influencer integration platform. It connects brands with digital content creators for end-to-end campaign management, influencer selection, milestone tracking, real-time collaboration, and secure escrow payments via Stripe.

Brandly is also described as “the pulse of creator commerce” — an ecosystem where vloggers, models, and storytellers meet high-growth brands through AI orchestration.

## Who is it for?
- **Brands**: Create campaigns, discover influencers, manage deliverables, fund escrow, approve work, and release payouts.
- **Influencers / Creators**: Apply to campaigns, connect social accounts, submit deliverables, chat with brands, and receive payouts via Stripe Connect.

## Key features for brands
- Campaign creation with briefs, industry targets, content requirements, platforms, and budgets
- Influencer directory with verified profiles and stats
- Milestone task board for deliverables (YouTube videos, Instagram stories, etc.) with due dates
- Stripe escrow funding before work begins
- Deliverable auditing: review links/files, request revisions, or approve to trigger payouts
- Team invites (Admin, Editor, Viewer roles)

## Key features for influencers
- OAuth social verification with YouTube, Instagram, and TikTok for real subscriber/video stats
- Campaign dashboard: apply, view active tasks, check earnings
- Workspace chat with file attachments
- Stripe Connect for direct bank payouts
- Instant payouts after KYC and a verified bank account (typically within 24 hours once approved)

## AI Matching
Brandly’s AI Matching Algorithm analyzes profile metrics, past campaign performance, and audience demographics, then compares them against brand requirements to suggest high-ROI partnerships. Match scores help both sides interpret fit quality.

## Payments & escrow
Standard lifecycle: Charge brand → Hold in escrow → Release payout on approval → Handle disputes/refunds.
Platform fees apply. Minimum payout and maximum single payment limits are configured by the platform.
Disputes: open a support ticket with the campaign ID; moderation reviews brief, content, and messages within 3–5 business days.

## Getting started
1. Register as a brand or influencer
2. Complete your profile (required before applying or posting)
3. Influencers: connect social accounts (YouTube, Instagram, TikTok)
4. Brands: create a campaign brief and fund escrow when ready
5. Use AI match / search to find partners, then collaborate in the workspace

## Support topics covered in Help Center
- Setting up a creator profile for visibility
- Connecting social accounts securely
- Understanding AI matching and match scores
- Direct deposit / instant payouts setup
- Platform fees and tax forms
- Creating an effective campaign brief
- Tracking ROI on influencer campaigns
- Pausing or canceling a campaign
- Resolving disputes with creators or brands

## Technical stack (for internal / demo answers)
- Frontend: React, Redux Toolkit, Tailwind CSS, Socket.io
- Backend: Node.js, Express, MongoDB, Stripe, Cloudinary, Passport Google OAuth
- Realtime: Socket.io multi-room chat

## Demo campaign IDs (for HTTP tool tests)
When asking the assistant to look up a campaign via tools, use:
- CAMP-100 — Summer Creator Drop (ACTIVE, Fashion, $5000)
- CAMP-200 — Product Launch Week (DRAFT, Beauty, $2500)
- CAMP-999 — Holiday Collab (COMPLETED, Lifestyle, $12000)
