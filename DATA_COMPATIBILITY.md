# Chinese Structure Lab — Learning History Compatibility Contract

This project treats learner history as durable user data.

## Non-negotiable rules

1. Never delete existing learning history during a feature upgrade.
2. Schema upgrades are additive whenever possible.
3. New fields receive defaults; old fields keep their meaning.
4. Old localStorage keys remain readable and are synchronized for backward compatibility.
5. Before first migration, preserve a small local backup snapshot.
6. Sentence history must survive content refactors through aliases from old text keys to stable IDs.
7. Unknown fields are preserved rather than silently discarded.
8. Event/history data is append-oriented. Derived views may change, raw learning evidence should not.
9. A future schema version must include an explicit migration from every supported prior version.
10. UI changes must not redefine what an existing stored field means.

## Current durable root

`csl_profile_v1`

Top-level shape:

- `schemaVersion`
- `createdAt`, `updatedAt`
- `preferences`
- `progress`
- `learning.sentences`
- `learning.sessions`
- `learning.events`
- `aliases.sentenceTextToId`
- `extensions`

## Legacy data currently migrated

- `csl_ui_language`
- `csl_large_text`
- `csl_encounters`
- `csl_unclear`
- `csl_scene_index`
- `csl_sessions`
- `csl_path_last_day`

Legacy keys are intentionally not deleted.

## Future parameter additions

When a future release adds fields such as listening confidence, pinyin exposure count, pronunciation encounters, scene familiarity, response latency, or agent recommendations, migration must only add those fields with safe defaults. Existing encounter counts, fuzzy marks, sessions, preferences and progress remain valid.

## Stable identity rule

New lessons should use explicit stable sentence IDs when practical. Existing text-keyed history is mapped through `aliases.sentenceTextToId`, so a sentence can later receive a stable ID without losing earlier encounters.

## Export

`CSLStorage.exportData()` returns a portable JSON backup containing the current profile and migration snapshots. A visible Export/Import UI can be added later without changing the stored history model.
