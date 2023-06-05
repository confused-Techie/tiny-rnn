const fs = require("fs");

const data = require("./data.js");
const utils = require("./utils.js");

// Create our dataset

/**
 * andGate:
 *  - inputs: 2
 * magicButton:
 *  - inputs: 4
 */

let dataset = data.findBadText;

//console.log(dataset.data);

const NeuronManager = require("./neuron-manager.js");

const nn = new NeuronManager({
  inputs: 78,
  hiddens: 50,
  outputs: 1,
  dataset: dataset.data
});

// Train the Network (10,000 Iterations)
nn.train(10000);

fs.writeFileSync("./neural-network/find-bad-text.checkpoint", JSON.stringify(nn.save(), null, 2));

// Test the Network

for (let i = 0; i < dataset.test.length; i++) {
  //console.log(`In: ${dataset.test[i].input}; Expected: ${dataset.test[i].expected}; Got: ${nn.activate(dataset.test[i].input)}`);
  console.log(`In: ${utils.flatAlphabetDecode(dataset.test[i].input)}; Expected: ${dataset.test[i].expected}; Got: ${nn.activate(dataset.test[i].input)}`);
}
