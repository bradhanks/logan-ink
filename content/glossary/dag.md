---
term: "Directed Acyclic Graph (DAG)"
slug: "dag"
shortDef: "A directed acyclic graph (DAG) is a diagram of variables connected by single-headed arrows with no cycles, used to encode causal assumptions and decide which variables to adjust for."
tags: ["causal-inference", "epidemiology", "methods"]
related: ["confounding", "collider-bias", "selection-bias", "causal-inference", "confounder-adjustment"]
---

A **directed acyclic graph (DAG)** represents each variable as a node and each assumed direct causal effect as an arrow from cause to effect. "Acyclic" means you can never follow arrows back to where you started — nothing causes itself. A DAG makes a researcher's causal assumptions explicit and visual, turning vague reasoning about "controlling for" variables into a checkable structure.

DAGs matter because they provide rules for *which* variables to adjust for. By tracing paths between exposure and outcome, you can identify confounding paths (which adjustment closes), mediators (which adjustment should usually leave open), and **colliders** (which adjustment wrongly opens). A valid adjustment set "blocks" all non-causal paths while leaving the causal path intact — the backdoor criterion.

The common pitfall is omitting variables or arrows you don't want to think about; a DAG is only as good as the assumptions drawn into it. It also encodes structure, not effect sizes, so it cannot tell you how strong a bias is, only whether one can exist.

For example, a simple cancer-prevention DAG might show *Income → Screening Access → Stage at Diagnosis* and *Income → Stage at Diagnosis*, signaling that income confounds the screening–stage relationship and should be adjusted for.
