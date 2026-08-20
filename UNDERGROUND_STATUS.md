# Chinese Structure Lab — Underground Status

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
