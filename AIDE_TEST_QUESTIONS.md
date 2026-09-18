# Aide × Brandly — test questions

Use these in the embedded widget on http://localhost:3001 (Aide must be on http://localhost:3000).

## Knowledge base (answers from uploaded Brandly doc — no tool needed)

1. What is Brandly and who is it for?
2. How does Brandly escrow / Stripe payment lifecycle work?
3. How does the AI matching algorithm work?
4. How do creators enable instant payouts?
5. What should I do if there is a dispute with a brand or creator?

## HTTP tools (should call live demo APIs)

1. What is the status of campaign CAMP-100?
   - Expect tool: `get_brandly_campaign_status` → ACTIVE / Summer Creator Drop
2. Look up campaign CAMP-999 and tell me its niche and budget.
   - Expect COMPLETED / Lifestyle / $12000
3. What plans does Brandly offer and what do they cost?
   - Expect tool: `list_brandly_plans` → Starter $29, Pro $79, onboarding kit $49
4. Search help for escrow / payouts.
   - Expect tool: `search_brandly_help`

## Web search (must ask for online / current public info)

1. Search online for current best practices for influencer marketing ROI in 2026.
2. Look up on the web how Stripe Connect payouts typically work for marketplaces.
3. Compare Brandly-style creator marketplaces with what public articles say about Aspire or Grin (online only).

Tip: for web search, phrase it with “search online”, “look up on the web”, or “current”. Store/knowledge questions alone will not trigger web search.
