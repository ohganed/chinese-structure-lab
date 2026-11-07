# Cognition Lab — Portable Design Notes (Research / Chinese-only implementation)

Updated: 2026-11-08

## Scope and safety

- **Changes are authorized for Chinese Structure Lab only** (`ohganed/chinese-structure-lab`).
- Other language apps are in repair. Do **not** copy files, open implementation PRs, modify existing scripts, deploy, or alter their learner data while this constraint remains.
- Only repository read-only inspection was performed for French, Russian and English. Connected GitHub did not identify a separate German or Spanish repository. This does **not** establish whether local work exists for them.
- This is a pedagogical hypothesis and a Chinese-only prototype, **not** a demonstrated first-in-the-world teaching method or a proven neural rewiring intervention.

## Theory to learning-operation mapping

| Source | Claim or research direction | App operation | Observable learner behavior |
|---|---|---|---|
| Albus & Meystel (Engineering of Mind) | Perception, world model, valuation, behavior generation in an intelligent-systems architecture | Identify actors, relationships, scene change and communicative goal | Chooses form expressing the intended scene |
| Pecher & Zwaan (Grounding Cognition) | Perception and action are relevant to conceptual and linguistic representation | Imagine a concrete scene before seeing language | Explains the event or relation without relying on word memorization |
| Chomsky (generative grammar) | Hierarchical structure matters to syntactic representation | Group subject, object, complements, modified phrase | Distinguishes sentences with matched lexical items but different roles |
| Moro (The Boundaries of Babel) | Human language syntax is constrained, and hierarchical structure is not reducible to arbitrary linear rules | Compare semantically contrasting constructions and structural roles | Transfers a structural pattern to new participants |
| Arden (Rewire Your Brain) | Plasticity and training habits; a general-audience application of neuroscience | Retrieve instead of only reread; spaced scheduling and learner reflection | Retries and transfers after a delay |

Moro and Chomsky are closely related theoretically; do not count them as independent confirmations. No claim of guaranteed changes to brain networks is made by the app. For retrieval/spacing outcomes use independent experimental literature, not the popular book alone.

## Implemented Chinese files

- `cognition-engine-core.js` — pure operations to validate lessons, normalize answers, compare examples and schedule self-reported retrieval; optional CSLStorage adapter.
- `cognition-zh-lessons.js` — **8 Chinese** scenarios, organized as independent lesson data.
- `cognition-transfer.html` — perception → goal → contrast → structure → own generation → transfer → reflection → review.
- `explore.html`, `cognition-lab.html`, and `cognition-lab-structure-memory.html` link to the new Chinese learning page.

Older Chinese lessons, original storage schema and existing review flows are not replaced.

## Lesson contract (v1)

Each item is an object:

```js
{
  id: "zh-relative-object-03", // permanent, globally distinct
  language: "zh",             // BCP-47 core language tag (two letters in v1)
  level: "B1",
  category: "...",
  scene: { ja:"...", en:"...", actor:"...", object:"...", movement:"...", result:"..." },
  goal: {ja:"...", en:"..."},
  question: {ja:"...", en:"..."},
  target: {text:"...", reading:"...", meaning:"..."},
  contrast: {text:"...", reading:"...", meaning:"..."},
  structure: {brackets:"...", chunks:[{text:"...",role:"..."}],noteJa:"...",boundaryJa:"..."},
  transfer: {promptJa:"...",target:{text:"...",reading:"...",meaning:"..."},noteJa:"..."},
  words: [{text:"...",reading:"...",meaning:"..."}]
}
```

The current browser page is Japanese-first; fields such as `scene.en` and `goal.en` are reserved for future display-language adapters. In a new language, keep the *schema* but replace every example and grammatical analysis with language-specific validated material. **Do not machine-transplant Chinese syntax or assume the same constraints exist in French, German, Russian or Spanish.**

## Storage contract and export

The Chinese adapter uses the existing `CSLStorage` API without replacing its schema:

- `progress.csl_cognition_core_v1` — keyed per-lesson retrieval stages and due dates.
- `progress.csl_cognition_discoveries_v1` — learner-written pattern-discovery notes.
- `learning.events` with `cognition_attempt_v1` and `cognition_review_v1` — selection, match/reveal flags and self-reported quality.

Neither the learner's actual entered Chinese answer nor recording/audio is stored by this new page. Existing Chinese Memory Weave JSON export includes the profile keys above. Existing cross-device merge for nested `progress` objects is **not** guaranteed conflict-free; avoid claiming that multi-device synchronization is complete.

Generic `CognitionCore` requires a host-supplied adapter with:
`load()`, `setProgress(key, object)`, and optionally `addEvent(type, data)`.
Other apps can adopt a separate, non-clashing namespace only after their restoration is stable.

## Chinese lesson coverage today

1. `把` + affected object + placement result — action vs state
2. Location predicate `在` — state vs action
3. `的` object relative — teacher knows student
4. `的` subject relative — student knows teacher
5. Directional complement `进` — going in
6. Directional complement `出` — going out
7. Result complement `完` — finishing vs ongoing activity
8. `给` — giver vs recipient

These are initial contrasts, not an A1–C2 complete course. The answer matcher checks known examples, not all grammatical alternatives. Failed string matching must not be described as a definitive grammar failure.

## Read-only observations about other apps (2026-11-08)

| App | Verified repository / evidence | Future non-invasive integration thought |
|---|---|---|
| French | `ohganed/french-structure-lab`; `index.html` already links `cognition.html`; `language-mode.js` has JA/EN/FR modes; `app.js` has a `french-structure-lab:v1:` state namespace | Compare its existing cognition feature and review semantics before designing an adapter. Preserve immersion modes. **No code changes.** |
| Russian | `ohganed/russian-structure-lab`; `PROJECT_CARD.md` defines canonical source-of-truth and repair/validation phases; `feature-map.html` provides navigation | Wait until the project card's validation gates have passed; preserve aspect, case and movement-verb model. **No code changes.** |
| English | `ohganed/-english-structure-lab`; a large standalone `index.html` with existing PWA settings | Inspect state model separately before potential adapter. **No code changes.** |
| German | No named repository matched on connected GitHub | Implementation location unverified; **no code changes** |
| Spanish | No named repository matched on connected GitHub | Implementation location unverified; **no code changes** |

## Testing performed

Chinese core was evaluated with actual source loaded in a sandboxed JS runtime:
- All 8 lessons pass the declared schema.
- No duplicate lesson IDs or identical target/contrast pairs.
- Chinese punctuation is ignored in answer comparison; French diacritics are retained.
- A correct self-report schedules next-day review; premature repeat does not extend the due date.
- A retry resets the learning stage and schedules 10 minutes.
- A mock CSLStorage adapter retained an unrelated preexisting progress key.
- Chinese HTML inline JavaScript parses, and referenced DOM IDs are present.

**Not yet verified:** full browser behavior on real iPhone/iPad, quality of every TTS voice, offline caching, long-term learning outcomes, and nested multi-device merge conflicts.

## Research / evaluation plan (not yet carried out)

For each structure, use matched groups or counterbalanced within-learner sessions: ordinary rereading and routine answer drills vs context/goal/structure/transfer prompts. Evaluate immediate and 7-day unseen scene-to-sentence generation; pre-register accepted alternatives, include blind human rating for naturalness, and measure completion burden. Keep teaching method and assessment format distinct to avoid a simple practice-test matching confound.

### Principal references

- Albus & Meystel (2001), [Engineering of Mind — NIST](https://www.nist.gov/publications/engineering-mind-introduction-science-intelligent-systems).
- Pecher & Zwaan (eds., 2005), *Grounding Cognition*, Cambridge University Press.
- Moro (2008; second ed. 2015), [The Boundaries of Babel — MIT Press](https://mitpress.mit.edu/9780262029858/the-boundaries-of-babel/).
- John B. Arden (2010), *Rewire Your Brain*, Wiley.
- Relevant modern reviews of retrieval and distributed practice are needed to support the schedule; actual best intervals may vary by task and learner.
