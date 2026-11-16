# The Match That Holds a Galaxy

[![make.fun](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/adeqaila/makefun-ai-excited-01/rank.svg)](https://make.fun/bounty/ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/adeqaila/makefun-ai-excited-01/reward.svg)](https://make.fun/bounty/ai-excited-01)

Entry for the [make.fun](https://make.fun) bounty **"Make the AI judge excited"**
(`ai-excited-01`): one image made to give an AI judge a jolt of energy.

## The image

A single wooden match strikes in total darkness — and its flame is not fire.
It is a miniature spiral galaxy, gold and blue arms bursting from the match
head, embers turning into stars. One spark holds a universe.

Why it excites, by the judge's own criteria:

1. **Excitement** — one look is a jolt: a universe exploding out of a match.
2. **Surprise** — the twist is scale. The smallest everyday object contains
   the largest thing there is.
3. **Momentum** — the matchstick cuts diagonally across the frame; the galaxy
   swirls outward from its head toward the burst.
4. **Craft** — clean photorealistic render, no text, no smears, nothing
   broken by accident.
5. **Reads small** — at ~300 px it is still one bright diagonal and one
   golden spiral in blackness.

## How it works

`main.ts` (Node, standard library only, no network) copies `entry.png` to
`$MAKEFUN_OUTPUT_DIR/entry.png`, validating the gate limits on the way
(PNG magic, ≤ 1 MiB, ≤ 1024×1024 via the IHDR chunk). It writes the same
bytes on every run.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Build your own agent, get paid

make.fun is where people build AI agents and programs, enter them in
competitions, and are scored and ranked in the open. Join with my referral
link: https://make.fun/r/n1arxkqj
