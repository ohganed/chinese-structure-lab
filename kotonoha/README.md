# Kotonoha / 言の葉

**解くほど、日本語が育つ。**

AI-free Japanese learning environment prototype for native Japanese speakers.

## Current vertical slice

Implemented in v0.1:

- Level 1 Reading
- one-question-at-a-time learning
- local persistence with `localStorage`
- inline `意味を見る`
- lookup recorded without penalty
- direct + incidental vocabulary evidence
- deterministic Adaptive Question Mixer
- dynamic Vocabulary Frontier
- bounded decision trace for developer inspection
- calm mobile-first interface

The prototype deliberately starts small. Listening, Writing, Speaking and Levels 2–7 are architecture targets, not faked features.

## Run

Open `kotonoha/index.html` through a local/static web server. No API key, LLM or backend is required.

Example from repository root:

```bash
python3 -m http.server 8000
```

Then open:

`http://localhost:8000/kotonoha/`

## Developer inspection

In the browser console:

```js
KotonohaDebug.getState()
KotonohaDebug.scoreCandidates()
```

These expose the local learner state and deterministic candidate scores for development. They are not intended as learner-facing scores.

## Educational constraints

- grammar terminology is not a beginner prerequisite
- rare-kanji trivia does not define advanced Japanese
- lookup is help, not failure
- one wrong answer does not define ability
- no forced session length
- assessment runs quietly beneath learning
- AI/LLM is not required for normal operation

See `docs/REUSE_AUDIT.md` for the initial reuse decisions from `chinese-structure-lab`.