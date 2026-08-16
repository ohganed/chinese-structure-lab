# Chinese Structure Lab — Curriculum Audit

Status: whole-curriculum first-pass audit

## Scope

Reviewed as one curriculum rather than isolated pages:

- A1 core skills
- A2 expansion / continuation / continuing world
- B1 expansion / continuation
- B2 expansion / continuation
- C1 core
- C2 core
- thematic built-in lessons including daily life, food, people, communication, services/problems, leisure/seasons and related pages

## Non-destructive rule

Existing sentence text is not silently deleted just because a more natural form is found. Learning history may already refer to that text. Clear improvements are therefore introduced through pedagogy layers as preferred natural forms or contextual continuations. Raw learning events remain valid.

## Audit dimensions

1. grammatical acceptability
2. idiomatic Mandarin naturalness
3. whether a speaker would actually say it in the represented situation
4. pragmatic register (service, casual, business, analytical)
5. translation fidelity
6. level appropriateness
7. continuity across adjacent sentences
8. planned re-use of important words and constructions
9. compatibility with Situation Graph and Reencounter Planner
10. accessibility of added explanations and audio

## Findings

The curriculum is strongest when sentences form a continuing world. A2 World and the B1 story sections already do this well. Earlier list-style sections contain useful material but benefit from contextual linking rather than additional isolated sentences.

Several sentences were grammatically interpretable but less idiomatic than preferable for a learner-facing model. These are now surfaced with preferred natural alternatives instead of silently overwriting history-linked source text. Examples include the hotel-phone passive sentence in A2, selected negotiation wording at B2, and a few overly literal analytical metaphors at C2.

At B1-C2, the major issue is not basic grammar but register and discourse naturalness. The curriculum should increasingly teach how claims are softened, reframed, qualified, challenged and connected rather than simply adding harder vocabulary.

## Curriculum direction

A1: situation → word → sentence → immediate response

A2: connected everyday events + planned re-use of A1 language

B1: personal narrative, explanation, reason, result, opinion and repair

B2: negotiation, structured disagreement, evidence and trade-offs

C1: abstraction, stance, uncertainty, policy/argument structure

C2: implication, register, information structure, rhetorical choice and pragmatic meaning

## Implementation

- `a1-pedagogy-layer.js`: A1 natural alternatives and micro-continuations
- `curriculum-pedagogy-layer.js`: A2-C2 and thematic lesson naturalness/context layer
- `situation-graph-engine.js`: links language to people, place, purpose and event
- `reencounter-planner.js`: proposes natural re-use rather than quiz-style review

Future revisions should prefer adding richer connections and better context over simply increasing sentence count.
