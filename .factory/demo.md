# Demo sandbox

Open `/demo` or `/?demo=1` to try Medication Handoff Card with sample data in
one click. The sample is Evelyn Parker's confirmed three-medicine list:
Lisinopril, Metformin ER, and Vitamin D3, with a short change history.

Demo records use the IndexedDB database named `demo:medication-handoff-card`.
Real records use `medication-handoff-card`; the two databases are never opened
in the same app session. The persistent demo banner says that nothing is saved
to the real card, provides **Reset demo**, and has **Start for real** to leave
without copying the example data. Leaving this way clears the demo database,
so later demo visits start from the original sample.

The demo works offline after its first visit because the PWA caches its shell
and the sample stays in the demo database. The exact observable checks are in
`.factory/claims.json` and the tagged Playwright tests.
