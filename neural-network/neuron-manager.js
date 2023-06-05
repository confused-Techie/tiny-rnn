const Neuron = require("./neuron.js");

class NeuronManager {
  constructor(opts) {

    this.inputCount = opts.inputs;
    this.hiddenCount = opts.hiddens;
    this.outputCount = opts.outputs;

    this.dataset = opts.dataset;

    this.inputs = [];
    this.hiddens = [];
    this.outputs = [];

    this.init();
  }

  init() {
    // Initialize all layers

    for (let i = 0; i < this.inputCount; i++) {
      this.inputs.push(new Neuron());
    }

    for (let i = 0; i < this.hiddenCount; i++) {
      this.hiddens.push(new Neuron());
    }

    for (let i = 0; i < this.outputCount; i++) {
      this.outputs.push(new Neuron());
    }

    // Connect Input Layer to Hidden Layer
    for (let i = 0; i < this.inputCount; i++) {
      for (let y = 0; y < this.hiddenCount; y++) {
        this.inputs[i].connect(this.hiddens[y]);
      }
    }

    // Connect Hidden Layer to Output Layer
    for (let i = 0; i < this.hiddenCount; i++) {
      for (let y = 0; y < this.outputCount; y++) {
        this.hiddens[i].connect(this.outputs[y]);
      }
    }

  }

  // Pass Info
  activate(input) {
    this.inputs.forEach((neuron, i) => neuron.activate(input[i]));
    this.hiddens.forEach(neuron => neuron.activate());
    return this.outputs.map(neuron => neuron.activate());
  }

  // Give Feedback
  propagate(target) {
    this.outputs.forEach((neuron, t) => neuron.propagate(target[t]));
    this.hiddens.forEach(neuron => neuron.propagate());
    return this.inputs.forEach(neuron => neuron.propagate());
  }

  // Looping
  train(iterations = 1) {
    while (iterations > 0) {
      this.dataset.map(datum => {
        this.activate(datum.inputs);
        this.propagate(datum.outputs);
      });
      iterations--;
    }
  }

  save() {
    let tmp = {
      inputCount: this.inputCount,
      hiddenCount: this.hiddenCount,
      outputCount: this.outputCount,
      dataset: this.dataset,
      inputs: {},
      hiddens: {},
      outputs: {}
    };

    // then lets call the save func of each input, hidden, and output
    for (let i = 0; i < this.inputCount; i++) {
      tmp.inputs[this.inputs[i].id] = this.inputs[i].save();
    }

    for (let i = 0; i < this.hiddenCount; i++) {
      tmp.hiddens[this.hiddens[i].id] = this.hiddens[i].save();
    }

    for (let i = 0; i < this.outputCount; i++) {
      tmp.outputs[this.outputs[i].id] = this.outputs[i].save();
    }

    return tmp;
  }

}

module.exports = NeuronManager;
