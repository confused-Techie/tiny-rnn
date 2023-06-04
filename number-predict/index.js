const tf = require("@tensorflow/tfjs");

// Define the model architecture
const model = tf.sequential();

model.add(tf.layers.dense({units: 1, inputShape: [1]}));
model.add(tf.layers.activation({activation: "sigmoid"}));

// Compile the model
model.compile({loss: "binaryCrossentropy", optimizer: "sgd"});

// Generate some traning data
const xs = tf.tensor2d([-2, -1, 1, 2, 3, 4], [6, 1]);
const ys = tf.tensor2d([0, 0, 0, 1, 1, 1], [6, 1]);

// Train the model
model.fit(xs, ys, {epochs: 1000}).then(() => {
  // Use the model to make predictions
  const result = model.predict(tf.tensor2d([-5, 4], [2, 1]));
  result.print();
});
