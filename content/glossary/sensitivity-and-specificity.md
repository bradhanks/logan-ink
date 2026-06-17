---
term: "Sensitivity and Specificity"
slug: "sensitivity-and-specificity"
shortDef: "Sensitivity is the proportion of people with the disease who test positive; specificity is the proportion of people without the disease who test negative."
tags: ["epidemiology", "diagnostic-testing", "biostatistics"]
related: ["screening-vs-diagnostic", "incidence-vs-prevalence", "selection-bias"]
---

**Sensitivity** and **specificity** describe a test's accuracy against a reference standard. Sensitivity (the true-positive rate) is how well a test detects disease among those who truly have it — high sensitivity means few false negatives. Specificity (the true-negative rate) is how well it clears those who are truly disease-free — high specificity means few false positives. Both are properties of the test (and the threshold chosen) and, importantly, do not depend on how common the disease is.

They matter because they govern what a test result means in practice. A highly sensitive test is good for *ruling out* disease when negative; a highly specific test is good for *ruling in* disease when positive. There is usually a trade-off: moving a cutoff to catch more cases (higher sensitivity) typically admits more false alarms (lower specificity), a relationship summarized by the ROC curve.

The crucial pitfall is confusing these with **predictive values**. The probability that a positive test means real disease (positive predictive value) depends heavily on prevalence — even a very specific test produces many false positives when disease is rare, which is why mass screening of low-prevalence populations can yield mostly false alarms. Sensitivity/specificity are fixed test properties; predictive values are not.

For example, a screening test with 95% sensitivity and 90% specificity will still flag many healthy people if the condition affects only 1 in 1,000, because the few true cases are swamped by the 10% false-positive pool.
