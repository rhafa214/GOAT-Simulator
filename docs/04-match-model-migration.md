# Match Model Migration

## Overview
The legacy `MatchStats` model currently mixes match results, player performance, and metadata into a single flat object. To support future expansions like score tracking, substitutions, yellow/red cards, and penalty shootouts, we are separating these concerns into a new domain model.

## New Types
We have introduced several new types in `src/core/domain/match.ts`:

- `MatchFixture`: Metadata about the match (teams, date, context, status).
- `MatchTeam`: Information about a participating team (id, name, score).
- `MatchContext`: Rules and importance (competition phase, national team match).
- `MatchResult`: The final outcome of the match (scores, extra time).
- `PlayerMatchPerformance`: Detailed stats for the player (minutes, goals, rating, cards).
- `MatchEvent`: A timeline event during the match (goal, card, sub).
- `MatchAggregate`: A root object combining fixture, result, events, and performance.

## Adapter Strategy
Because many components currently depend on the legacy `MatchStats` type, we have implemented an adapter in `src/core/domain/matchAdapter.ts`.

- `toLegacyMatchStats(aggregate, playerTeamIdOrName)`: Converts the new `MatchAggregate` back into a `MatchStats` object so existing UI components do not break.
- `fromLegacyMatchStats(legacy, playerTeamId, playerTeamName)`: Converts old `MatchStats` into the new aggregate model if we need to hydrate state.

## Next Steps
1. Refactor the match simulation logic (`MatchEngine`) to produce a `MatchAggregate`.
2. Convert the aggregate to `MatchStats` when dispatching the `PLAY_MATCH` action.
3. Incrementally update UI components (like `DashboardView` and `MuseumView`) to consume `MatchAggregate` instead of `MatchStats`.
4. Eventually remove `MatchStats` and the adapters.
