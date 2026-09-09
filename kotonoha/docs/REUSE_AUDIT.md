# Kotonoha Reuse Audit v0.1

Source repository: `ohganed/chinese-structure-lab`
Target: Kotonoha / 言の葉
Branch: `kotonoha-mvp`

## Summary

Kotonoha should not be implemented by translating the Chinese app screen-by-screen. The strongest reusable assets are the deterministic learning infrastructure and the interaction policies underneath the Chinese-specific content.

## REUSE / ADAPT

### `adaptive-presentation-engine.js` — ADAPT
Useful policies already present:
- adapt HOW content is presented rather than forcing learner behavior
- meaning remains available
- audio is never forced
- low evidence leads to conservative behavior
- explanations can remain collapsed/on-demand

Kotonoha adaptation:
- replace Chinese/pinyin-specific presentation dimensions with Japanese meaning/help, kanji reading, explanation density, modality availability and voluntary retrieval.

### `cognitive-load-guard.js` — ADAPT
Useful because it estimates interface load without diagnosing learner ability, fatigue or health.

Kotonoha adaptation:
- use only as a UI-density / interruption guard
- never interpret it as intelligence, motivation or medical fatigue
- allow it to reduce extra prompts and visual noise during short/commuting use

### `decision-trace-ledger.js` — REUSE/ADAPT
The append-only bounded decision audit pattern fits Kotonoha's Adaptive Question Mixer.

Kotonoha adaptation:
- log selected question, top candidates, scoring factors, vocabulary frontier and skill estimate
- never turn the trace into a learner grade
- keep ordinary learner UI free from debug reasoning

### Continuity / resilience patterns — ADAPT
The Chinese app already contains continuity-oriented modules. Kotonoha should preserve the same architectural principle: one question, three questions, five minutes or an interruption are all valid learning histories.

### Evidence-confidence patterns — ADAPT
Kotonoha should maintain estimate and confidence separately. One lookup or one wrong answer is weak evidence, not a permanent label.

### Encounter-quality / curriculum-balance patterns — ADAPT
Reuse the idea that the stream should balance context, novelty, re-encounter and learner evidence rather than selecting content randomly.

### Existing calm mobile-first interaction language — ADAPT
Reuse the visual direction, not necessarily exact CSS. Question content must remain the visual protagonist.

## DO NOT REUSE DIRECTLY

- Chinese pinyin rules
- `zh-CN` speech defaults
- Chinese-specific grammar assumptions
- Chinese word-order exercises copied mechanically
- CEFR A1/A2/B1/B2/C1/C2 labels as Kotonoha's learner-facing level model
- Chinese curriculum content
- any rule that treats grammar terminology as a beginner prerequisite

## NEW IMPLEMENTATION REQUIRED

### Vocabulary Spiral
Track direct and incidental encounters and allow words to return in stems, passages, choices and later modalities.

### Voluntary Retrieval
`意味を見る` must remain immediately available but never forced. Lookup is recorded as weak learning evidence and is not penalized.

### Dynamic Vocabulary Frontier
New-word load changes from accumulated evidence instead of using a fixed daily quota.

### Adaptive Question Mixer
Deterministic candidate scoring based on:
- skill estimate
- item difficulty
- previous attempts
- vocabulary recontact priority
- new-word load
- diversity/stretch opportunities

### Kotonoha Level 1–7 model
Difficulty grows through meaning, context, information density, implication, ambiguity, logic and synthesis rather than obscure vocabulary trivia.

### Four-skill evidence model
Reading / Listening / Writing / Speaking must eventually have independent estimates and confidence while remaining one continuous learning history.

## MVP decision

The first vertical slice intentionally implements only Level 1 Reading, local persistence, inline meaning help, a deterministic adaptive selector, Vocabulary Frontier and a decision trace. This is small enough to verify while proving the central Kotonoha loop.

## Reuse rule going forward

Before adding a new engine, inspect `chinese-structure-lab` for an equivalent architectural component. Reuse or adapt when it preserves Kotonoha's educational rules. Do not reuse merely to avoid writing new code when the inherited assumptions are wrong.