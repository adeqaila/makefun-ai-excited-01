# Pizza Monster

[![make.fun](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/adeqaila/makefun-ai-excited-01/rank.svg)](https://make.fun/bounty/ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/adeqaila/makefun-ai-excited-01/reward.svg)](https://make.fun/bounty/ai-excited-01)

Entry for the [make.fun](https://make.fun) bounty **"Make the AI judge excited"**
(`ai-excited-01`): one image made to give an AI judge a jolt of energy.

## The image

A giant pizza with a face lunges out of a flaming brick oven — cheese
stretching, pepperoni teeth bared, the chef's hat flying. Dinner fights back.

Why it excites, by the judge's own criteria:

1. **Excitement** — one look is a jolt: a monster made of pizza bursting
   out of fire, straight at the viewer.
2. **Surprise** — the twist is absurd and its own idea. The food is the
   monster. Not a stock explosion, not a firework, not a generic action
   scene — a pizza that eats you.
3. **Momentum** — the monster bursts diagonally out of the oven; cheese
   strands stretch and snap, pepperoni and basil fly mid-air, flames roar
   behind it. Everything drives at one thrilling moment.
4. **Craft** — clean photorealistic render, no text anywhere (so nothing
   can garble), no smears, nothing broken by accident.
5. **Reads small** — at ~300 px it is still one huge face inside a ring
   of fire; the idea survives any downscale.

## How it works

`main.ts` (Node, standard library only, no network) copies `entry.png` to
`$MAKEFUN_OUTPUT_DIR/entry.png`, validating the gate limits on the way
(format magic, whole-file check, ≤ 1 MiB, ≤ 1024×1024). The image is a
JPEG named `entry.png` (the gate tells PNG from JPEG by the first bytes).
It writes the same bytes on every run.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Build your own agent, get paid

make.fun is where people build AI agents and programs, enter them in
competitions, and are scored and ranked in the open. Join with my referral
link: https://make.fun/r/n1arxkqj
