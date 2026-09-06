# Chinese Structure Lab — A1/A2 UI Audit

Status: FAIL — migration incomplete

## Required A1/A2 learning sequence

For every course presented to the learner as A1 or A2:

1. blank meaningful-unit buttons (no Hanzi initially)
2. first tap: audio only
3. second tap: Hanyu Pinyin
4. third tap: English meaning
5. fourth tap: Japanese meaning
6. later taps: Hanzi, structure, usage, examples and deeper analysis
7. separate whole-sentence button with the same progressive sequence
8. button units are lexical/pedagogical units, not one-button-per-character
9. Mental Scene emoji is optional and must suggest the situation rather than translate each word

## Audit findings

### FAIL 1 — Explore still routes learners to legacy A1 pages

Explore currently exposes the existing A1 situation pages plus Foundation Pack I and Core Skills Expansion. These pages were not globally migrated to Discovery UI.

Representative legacy page `daily.html`:
- full Hanzi sentence visible immediately
- full pinyin visible immediately
- English meaning visible immediately
- Japanese meaning visible immediately
- word controls appear only later inside details

This directly violates the required A1/A2 sequence.

### FAIL 2 — Foundation Pack I is still legacy sentence-first UI

`a1-foundation-pack-1.html` still renders Hanzi + pinyin + English + Japanese before interaction.

### FAIL 3 — A1 Discovery pages exist but are not the main Explore routes

Discovery prototypes / expansions exist, including:
- `a1-discovery-prototype.html`
- `a1-foundation-discovery-2.html`

However, creating a Discovery page did not migrate the pages users actually open from Explore.

### FAIL 4 — A2 Everyday Expansion I/II are sentence-first

`a2-expansion.html` and `a2-more.html` render complete Chinese sentences and meanings directly. They do not provide the required blank meaningful-unit discovery buttons.

### FAIL 5 — A2 World is also Hanzi-first

`a2-world.html` initially displays the full Chinese sentence. Pinyin and meaning are hidden behind separate buttons, but the required order begins with blank lexical-unit buttons and audio discovery, so this is not compliant.

### FAIL 6 — legacy Word Touch Engine uses the wrong sequence

`word-touch-engine.js` v8 uses:

Chinese visible -> audio -> meaning -> details -> Chinese

It does not use:

blank -> audio -> pinyin -> English -> Japanese -> deeper detail

This engine is still loaded by many legacy pages.

### FIXED 1 — false English meaning unavailable caused by legacy conversion

The old `legacy-word-touch-upgrader.js` discarded `.wordgloss` English text while converting legacy word buttons. This caused false `English meaning unavailable` messages even when the source lesson contained an English gloss.

Updated to v4:
- preserve `.wordgloss` as `en`
- preserve sentence English/Japanese in examples
- avoid silently treating English gloss as Japanese

This fixes one major source of false missing-English states.

## English meaning audit

There are two distinct problems and they must not be confused:

1. **Data exists but adapter drops it**
   - confirmed in legacy A1 pages such as `daily.html`
   - fixed in legacy upgrader v4

2. **Per-word English data does not exist in the lesson schema**
   - sentence-level English may exist, but A2 pages often have no word/chunk objects at all
   - cannot be truthfully repaired by displaying sentence translation as a word meaning
   - requires explicit lexical/chunk enrichment

## Migration requirement

A1/A2 should not depend on a cosmetic adapter alone. Each sentence needs structured discovery data:

```js
{
  scene: "...",
  zh: "...",
  pinyin: "...",
  en: "...",
  ja: "...",
  words: [
    { zh: "...", pinyin: "...", en: "...", ja: "..." }
  ],
  note: "..."
}
```

Every word/chunk object must have:
- zh
- pinyin
- en
- ja

No `English meaning unavailable` should be accepted for curated A1/A2 core material unless the item is deliberately non-lexical and documented.

## Acceptance criteria

A course labelled A1 or A2 is PASS only when:

- [ ] no sentence Hanzi is visible before learner interaction
- [ ] meaningful-unit buttons start blank
- [ ] tap 1 plays word/chunk audio
- [ ] tap 2 reveals word/chunk Pinyin
- [ ] tap 3 reveals English meaning
- [ ] tap 4 reveals Japanese meaning
- [ ] later reveal includes Hanzi and deeper structure
- [ ] whole-sentence button follows the same progression
- [ ] every curated word/chunk has English meaning
- [ ] every curated word/chunk has Japanese meaning
- [ ] every curated word/chunk has Pinyin
- [ ] multi-character lexical words remain one button when appropriate
- [ ] Mental Scene does not simply translate each word
- [ ] Explore points only to compliant A1/A2 experiences

## Current verdict

A1 UI migration: FAIL / partial prototype only
A2 UI migration: FAIL / partial prototype only
English sentence meaning coverage: generally present in inspected core pages
English word/chunk meaning coverage: FAIL / inconsistent
False English-unavailable adapter bug: FIXED

Next implementation priority:
1. migrate the actual Explore-linked A1 pages
2. enrich missing per-word Pinyin/English/Japanese data
3. migrate A2 Expansion I/II and A2 World
4. update Explore only after each destination passes the acceptance checklist
