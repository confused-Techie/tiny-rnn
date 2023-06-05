# Neural Network

Here's me abondoning the idea of making a Recurrent Neural Network and making something.

## Detect an AND Gate

Dataset:

```js
const dataset = [
  { inputs: [0,0], outputs: [0] },
  { inputs: [0,1], outputs: [0] },
  { inputs: [1,0], outputs: [0] },
  { inputs: [1,1], outputs: [1] }
];
```

Outputs:

```
--- Inputs: 2 ; Hiddens: 2 ; Outputs: 1 ; Train: 10,000 ---

In: [0,0]: 0.0007270419712464212
In: [0,1]: 0.012716500811421012
In: [1,0]: 0.012798775305857983
In: [1,1]: 0.9820264155882907

--- Inputs: 2 ; Hiddens: 50 ; Outputs: 1 ; Train: 10,000 ----

In: [0,0]: 0.0000012951723054708363
In: [0,1]: 0.010302795856960128
In: [1,0]: 0.01029529429503732
In: [1,1]: 0.9858702233771914

--- Inputs: 50 ; Hiddens: 50 ; Outputs: 1 ; Train: 10,000 ---

In: [0,0]: 0.000017083717593870327
In: [0,1]: 0.008563564728997004
In: [1,0]: 0.00837034370847586
In: [1,1]: 0.9881383202101618

--- Inputs: 50 ; Hiddens: 50 ; Outputs: 1 ; Train: 50,000 ---
In: [0,0]: 0.0000012281681982433274
In: [0,1]: 0.0033082761085424964
In: [1,0]: 0.0033055266275142823
In: [1,1]: 0.9952573723161218

--- Inputs: 2 ; Hiddens: 50 ; Outputs: 1 ; Train: 50,000 ---
In: [0,0]: 8.884712494441993e-8
In: [0,1]: 0.0041226672292229895
In: [1,0]: 0.004036684878339913
In: [1,1]: 0.994325801070113

--- Inputs: 2 ; Hiddens: 2 ; Outputs: 1 ; Train: 50,000 ---
In: [0,0]: 0.001007047845069981
In: [0,1]: 0.006590753691333286
In: [1,0]: 0.006599414225563882
In: [1,1]: 0.9925420857178926

--- Inputs: 2 ; Hiddens: 2 ; Outputs: 1 ; Train: 500,000 ---
In: [0,0]: 0.00007422513432511002
In: [0,1]: 0.001485863619061017
In: [1,0]: 0.0014866024862299648
In: [1,1]: 0.997836701114512
```

So based on this, it looks like higher hiddens and training time is more important than inputs.
