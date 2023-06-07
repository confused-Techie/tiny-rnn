const NeuronManager = require("./neuron-manager.js");

const dataset = {
  data: [
    { inputs: [0,0], outputs: [0] },
    { inputs: [0,1], outputs: [0] },
    { inputs: [1,0], outputs: [0] },
    { inputs: [1,1], outputs: [1] }
  ],
  test: [
    { input: [0,0], expected: [0] },
    { input: [0,1], expected: [0] },
    { input: [1,0], expected: [0] },
    { input: [1,1], expected: [1] }
  ]
};

const nn = new NeuronManager({
  inputs: 2,
  hiddens: 2,
  outputs: 1,
  dataset: dataset.data
});

// Train the Network (10,000 Iterations)
nn.train(10000);

// Test the network

for (let i = 0; i < dataset.test.length; i++) {
  console.log(`In: ${dataset.test[i].input}; Expected: ${dataset.test[i].expected}; Got: ${nn.activate(dataset.test[i].input)}`);
}

//let obj = nn.activateObj(dataset.test[0].input);
//console.log(obj);

//console.log(nn.activate([0,0]));
//console.log(nn.activate([0,1]));
//console.log(nn.activate([0,0]));
