---
term: "Collider Bias"
slug: "collider-bias"
shortDef: "Collider bias is a spurious association induced between two variables when an analysis conditions on (stratifies, adjusts for, or selects on) a common effect of both."
tags: ["causal-inference", "epidemiology", "bias"]
related: ["confounding", "selection-bias", "dag", "causal-inference", "confounder-adjustment"]
---

A **collider** is a variable that is caused by two (or more) other variables — in a causal diagram, two arrows "collide" into it. Conditioning on a collider, whether by adjusting for it in a model or by selecting study subjects based on it, opens a non-causal path between its causes and creates an association where none existed (or distorts a real one). This is the formal mechanism behind many puzzling findings.

Understanding colliders matters because the instinct to "control for more variables" can actively *introduce* bias. Unlike confounders, which should be adjusted for, colliders should generally be left alone. **Selection bias** is often collider bias in disguise: selecting a sample on a common effect of exposure and outcome conditions on a collider.

The classic pitfall is the "obesity paradox" pattern: among hospitalized patients, a risk factor can appear protective because hospitalization is a collider influenced by both the risk factor and other causes of admission. The fix is to draw a **DAG** and identify which variables are colliders before modeling.

For example, suppose both genetic risk and a lifestyle factor independently increase the chance of being enrolled in a cancer registry. Studying only enrolled patients can create a false inverse association between genetics and lifestyle, even if they are unrelated in the general population.
