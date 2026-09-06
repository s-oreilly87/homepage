# Thrifty portfolio evidence (HOME-01 / THR-2)

The Thrifty card uses actual local application captures from September 6, 2026.
The title opens a 59-second, 1920×1080 WebM tour of completed execution history;
it is not a live public application or a recording of provider work as it ran.
The image carousel contains the graph, recorded Executor attempt and Validation.

The shown run is THR-1154, `orchestration:ticket:9e40d389ceafc5a7ee13f544`.
Normal Tracker UI launch used Reviewed 1.0.2 and `codex:sol-high` for Executor and
independent Reviewer. It delivered PR 768 at 09:12:52 UTC, with remote head
`737d4f05f21bd7664b35f2b91c4248a8b0ef32ce`. Two subsequent ordinary runs delivered
PRs 769 and 770. Restart retained their exact attempts, report hashes and receipts,
with no extra dispatch or PR. The complete denominator is five deliveries across
six ordinary runs, including an earlier failed review-recovery case.

The live qualification controller was `08f111c6fda0ac9a27f311bac01d0620c8c49481`;
the recording's presentation controller was `4f13a6375042956e0a79a55230d5d533d7521708`.
UI projection corrections display the same immutable execution history. There
are no seeded run results or manufactured provider responses in the media.
The source repository is private, so this card omits an inaccessible GitHub link.
It remains labeled In progress: hierarchy, broader recovery, legacy retirement,
and hosted rollout are separate qualifications.

Authoritative internal source: Thrifty's `docs/dogfood/thr-1142-local-reviewed.md`
and `docs/dogfood/evidence/thr-1142-qualified.json`, with exact candidate, validation,
review, accepted-delivery receipt and independently read GitHub head identities.
Subscription billing was unavailable; the configured $5 run cap is not a charge.

The media decoder accepted all 590 frames without errors. The production Next
build passes; desktop, mobile, image navigation/modal and recording playback are
checked before PR handoff. No environment files, dependencies or other project
copy were changed. Sean's PR review precedes publication.
