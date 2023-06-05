
// Create our dataset
const dataset = [
  { inputs: [0,0], outputs: [0] },
  { inputs: [0,1], outputs: [0] },
  { inputs: [1,0], outputs: [0] },
  { inputs: [1,1], outputs: [1] }
]; // Simple AND Gate Dataset

const NeuronManager = require("./neuron-manager.js");

const nn = new NeuronManager({
  inputs: 2,
  hiddens: 2,
  outputs: 1,
  dataset: dataset
});

// Train the Network (10,000 Iterations)
nn.train(500000);

// Test the Network
console.log(`In: [0,0]: ${nn.activate([0,0])}`);
console.log(`In: [0,1]: ${nn.activate([0,1])}`);
console.log(`In: [1,0]: ${nn.activate([1,0])}`);
console.log(`In: [1,1]: ${nn.activate([1,1])}`);
