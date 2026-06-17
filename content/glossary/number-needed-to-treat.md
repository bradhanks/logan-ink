---
term: "Number Needed to Treat"
slug: "number-needed-to-treat"
shortDef: "The number needed to treat (NNT) is the number of people who must receive an intervention to prevent one additional bad outcome, calculated as the reciprocal of the absolute risk reduction."
tags: ["biostatistics", "clinical-methods", "measures-of-association"]
related: ["risk-difference", "relative-risk", "screening-vs-diagnostic", "confidence-interval"]
---

The **number needed to treat (NNT)** translates an effect size into an intuitive count: how many patients must be treated, over a given time horizon, for one of them to benefit who otherwise would not have. It is simply the reciprocal of the **risk difference** (absolute risk reduction): NNT = 1 / ARR. An NNT of 1 would mean everyone treated benefits; larger NNTs mean the benefit is spread thinly. The analogous harm measure is the number needed to harm (NNH).

NNT matters because it expresses impact on the absolute scale and is easy for clinicians, patients, and policymakers to reason about — far more so than a relative risk. It naturally weighs benefit against the burden, cost, and side effects of treating many people to help one.

A central pitfall is that NNT depends on baseline risk and time horizon, so it is not transportable across populations: the same drug has a smaller NNT (more efficient) in high-risk groups than in low-risk ones. Quoting an NNT without its time frame and population is misleading, and NNTs derived from relative risks applied to a different baseline can be wrong. A confidence interval should accompany it, and when an effect is non-significant the NNT can be undefined.

For example, if an intervention lowers a five-year outcome risk from 10% to 8%, the ARR is 0.02 and the NNT is 1 / 0.02 = 50 — fifty people treated for five years to prevent one event.
