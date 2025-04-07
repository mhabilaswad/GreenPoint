import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

let model;

export const loadModel = async () => {
  if (!model) {
    model = await tf.loadLayersModel('file://path/to/your/model/model.json'); // Adjust the path to your model
  }
  return model;
};

export const runKerasModel = async (imagePath) => {
  const model = await loadModel();

  // Load and preprocess the image
  const imageBuffer = fs.readFileSync(imagePath);
  const tfimage = tf.node.decodeImage(imageBuffer);
  const resizedImage = tf.image.resizeBilinear(tfimage, [224, 224]); // Adjust size based on your model
  const batchedImage = resizedImage.expandDims(0).toFloat().div(tf.scalar(255)); // Normalize the image

  // Run the model
  const predictions = model.predict(batchedImage);
  const result = predictions.dataSync(); // Get the result

  // Assuming your model outputs a single value for classification
  const classificationResult = result[0]; // Adjust based on your model's output

  return classificationResult; // Return the classification result
}; 