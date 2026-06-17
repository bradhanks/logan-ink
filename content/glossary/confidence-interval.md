---
term: "Confidence Interval"
slug: "confidence-interval"
shortDef: "A confidence interval is a range of plausible values for a population parameter computed so that, under repeated sampling, a stated percentage (e.g. 95%) of such intervals would contain the true value."
tags: ["biostatistics", "inference", "uncertainty"]
related: ["p-value", "relative-risk", "odds-ratio", "risk-difference", "number-needed-to-treat"]
---

A **confidence interval (CI)** expresses the uncertainty in an estimate due to sampling variability. A 95% CI is constructed by a procedure that, repeated across many samples, would capture the true parameter 95% of the time. The width of the interval reflects precision: larger samples and less variability yield narrower intervals. A CI conveys both an effect's magnitude and the range of values the data are compatible with.

CIs matter in population science because they shift attention from a binary "significant or not" verdict to the range of effects the study can and cannot rule out. For a ratio measure like a relative risk or odds ratio, whether the 95% CI excludes 1 corresponds to statistical significance at the 0.05 level — but the interval also shows whether non-significance reflects a true null or merely an underpowered study.

The classic pitfall is the misinterpretation that "there is a 95% probability the true value lies in *this* interval." In frequentist terms the parameter is fixed and a given interval either contains it or not; the 95% refers to the long-run performance of the method. Also, a CI captures random error only, not bias from confounding or selection.

For example, a relative risk of 0.80 with a 95% CI of 0.62–1.03 is a point estimate suggesting benefit, but the interval still includes 1, so a null effect cannot be excluded.
