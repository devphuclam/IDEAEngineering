# Q-15 frozen measurement definitions

Status: frozen for this run before timed execution. Numeric comparison thresholds
are `THRESHOLD BLOCKED` until Product Decision Authority accepts them.

## Fairness controls

Use the same physical machine, Windows image, power state, Server/API process,
Workspace process, fixture profile, network path (loopback), locale, scenario,
release-mode build, number of repetitions, warm-up rule, and instrumentation
principle. Do not compare Debug to Release or warm to cold. Retain every sample;
document exclusions instead of silently deleting outliers.

## Metrics

| Metric | Start | Stop / sample | Unit |
|---|---|---|---|
| Cold usable startup | Candidate processes absent and caches not deliberately primed; launch issued | Login/search control accepts input and app reports `q15-ready` | ms |
| Warm usable startup | One untimed launch completed; process restarted | Same readiness signal | ms |
| Idle memory | Ready, no operation for 10 seconds | Working set/private bytes of candidate-owned processes | bytes |
| Active/peak memory | Frozen critical flow with `large` fixture | sampled each 100 ms; max retained | bytes |
| CPU | Same active interval | process CPU time / wall interval and logical processors | percent + ms |
| Web bundle/download | Clean release output | compressed/uncompressed static assets | bytes |
| Desktop install size | Clean publish/build output, excluding SDK/cache | recursive file bytes | bytes |
| Input-to-visible | Search/edit input event timestamp | next painted/settled visible state marker | ms p50/p95/p99 |
| Scroll latency | scripted equal-distance grid/tree scroll input | next frame/state marker | ms p50/p95/p99 |
| Edit latency | inline edit commit | updated cell visible | ms p50/p95/p99 |
| Build duration | dependency lock already resolved; clean output | command terminal result | ms |

At least 10 measured repetitions are requested for startup and 100 interactions
for input/scroll/edit when the harness can automate them. A smaller observed sample
is reported as partial evidence, never extrapolated into PASS.
