# Chinese Structure Lab — Underground Status (50 floors)

## Floor 23: Interaction Ledger

The underground already contained storage, learner memory, quiet learner modelling,
natural re-encounter planning, context matching, cognitive-load protection,
intervention budgeting, governance, decision tracing, and runtime self-tests.

Floor 23 connects those engines to ordinary lesson actions across the app.
`interaction-ledger.js` observes only meaningful learner-initiated controls:

- touching a Chinese word
- requesting natural or slow audio
- revealing meaning or pinyin
- opening structure detail
- marking uncertainty
- moving to another scene

These events enter the durable append-oriented Learning Profile and immediately
notify the underground integration bus. `learning-memory-engine.js` v2 derives
counts for audio pace, word touches, meaning reveals, pinyin use, structure opens,
and scene movement. The counts are evidence for reversible support choices, never
grades or claims of mastery.

## Privacy and agency boundary

The ledger does not record typed text, correctness, scores, identity, or passive
mouse movement. It does not autoplay, rearrange the interface, interrupt the
learner, or spend the intervention budget. The learner's explicit choices continue
to outrank inferred preferences.

## Compatibility

Existing `csl_profile_v1` history and legacy localStorage keys remain readable.
The ledger only appends events and adds timestamps/extras to existing sentence
records. It does not delete or redefine prior data.

## Runtime verification

`underground-runtime-self-test.js` v3 checks that the ledger is present and that
its no-correctness, no-grades, and no-typed-text safeguards remain declared.
The shared-layer workflow connects exactly one ledger script to every HTML page
and validates JavaScript syntax and wiring.

## Floors 24–50

| Floors | System | Purpose |
|---|---|---|
| 24–29 | Temporal Pattern | Normalize duplicate surface signals, separate recent and long-term evidence, compare trends, and cap confidence. |
| 30–35 | Support Regulation | Estimate support demand, fade support only when evidence permits, return it immediately when requested, and keep audio/pinyin/meaning recoverable. |
| 36–41 | Curriculum Balance | Watch modality, context, vocabulary, structure, difficulty mix, novelty, and re-encounter diversity without treating coverage as mastery. |
| 42–47 | Continuity & Resilience | Restore the last place, preserve open loops without task pressure, detect session boundaries, verify schema/history, and protect offline privacy. |
| 48 | Deep Snapshot | Aggregate floors 24–47 into one read-only underground snapshot. |
| 49 | Invariant Auditor | Verify that the underground is healthy before it receives any adaptive authority. |
| 50 | Underground Constitution | Freeze automatic adaptation when an invariant fails while leaving ordinary learner controls available. |

## Floor 50 constitution

The following rules are non-negotiable:

- learner agency outranks inference
- no grades or correctness judgement
- no forced review, streak, absence penalty, or welcome-back praise
- no deletion or reinterpretation of learning history
- no typed-text or identity collection
- no hiding meaning, pinyin, or other recovery controls
- no direct UI control from the underground
- doing nothing is always a valid decision
- every permitted adaptation is bounded and reversible
- accessibility overrides adaptation

`underground-governor.js` v2 and `underground-integration-bus.js` v4 consult
Floor 50 before an adaptive opportunity can spend attention budget. A failure
therefore suppresses automatic intervention; it does not lock or punish the learner.

## Efficiency safeguards

- Interactive cues update classes idempotently, so their DOM observer settles instead
  of waking itself repeatedly.
- Cross-tab storage events wake the underground only when primary learning data,
  preferences, progress, or aliases change. Derived underground snapshots and audit
  writes do not bounce recalculation between open tabs.
