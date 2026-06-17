---
term: "Risk Difference"
slug: "risk-difference"
shortDef: "The risk difference (RD), or absolute risk reduction, is the arithmetic difference in the probability of an outcome between an exposed and an unexposed group."
tags: ["measures-of-association", "epidemiology", "biostatistics"]
related: ["relative-risk", "odds-ratio", "number-needed-to-treat", "confidence-interval"]
---

The **risk difference (RD)** subtracts the risk in the unexposed group from the risk in the exposed group (or, for an intervention, control risk minus treated risk). Unlike the relative risk, it is an *absolute* measure expressed on the original probability scale. An RD of 0 means no effect; a positive RD means excess risk from the exposure; a negative RD (an absolute risk reduction) means the exposure prevents cases.

RD matters in population science because it captures **public-health impact**: it answers "how many cases per 100 people does this exposure add or prevent?" Its reciprocal is the **number needed to treat**, and multiplying RD by a population size estimates the absolute number of cases attributable to the exposure.

The common pitfall is reporting only relative measures, which can make a tiny absolute effect sound dramatic. A treatment that cuts risk from 0.0002 to 0.0001 has an impressive RR of 0.5 but an RD of just 0.0001 — one case prevented per 10,000 treated. Always pair relative and absolute measures.

For example, if a community program lowers a year's incidence from 8% to 5%, the risk difference is 3 percentage points, meaning 3 fewer cases per 100 participants.
