import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4 text-green-600">Learn More – About GreenPoint</h2>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">What is GreenPoint?</h3>
          <p className="text-white text-sm mb-4">
            GreenPoint is a sustainability-driven platform designed to encourage eco-friendly behavior through a point-based reward system. Users are invited to upload photos of plants they grow, contributing to a greener planet while earning rewards. It's simple, engaging, and impactful.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">How Does It Work?</h3>
          <ol className="list-decimal list-inside mb-4 text-white text-sm">
            <li>Plant a tree or crop.</li>
            <li>Take a photo of your plant.</li>
            <li>Upload the photo on our website.</li>
            <li>Our AI model (powered by a Convolutional Neural Network - CNN) detects and classifies the plant.</li>
            <li>You earn GreenPoints based on the classification and growth stage.</li>
          </ol>
          <p className="text-white text-sm mb-4">
            The more you plant and share, the more points you collect. These points can later be redeemed for eco-friendly products, discounts, or even donated to environmental causes.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">What Technology Is Behind It?</h3>
          <p className="text-white text-sm mb-4">
            We utilize Convolutional Neural Networks (CNN), a type of Deep Learning model specialized in image recognition. When you upload a photo, the model analyzes the image and identifies the plant species. This helps us verify real contributions and maintain a trustworthy ecosystem.
          </p>
          <p className="text-white text-sm mb-4">
            Our model is trained on thousands of plant images, enabling it to recognize various types of trees, vegetables, flowers, and crops with high accuracy. The use of AI ensures that our reward system is both fair and scalable.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">Why Is This Important?</h3>
          <p className="text-white text-sm mb-4">
            Climate change and environmental degradation are global challenges. By planting and growing vegetation, individuals can:
          </p>
          <ul className="list-disc list-inside mb-4 text-white text-sm">
            <li>Improve air quality</li>
            <li>Enhance biodiversity</li>
            <li>Reduce carbon footprint</li>
            <li>Support sustainable food systems</li>
          </ul>
          <p className="text-white text-sm mb-4">
            GreenPoint turns these individual efforts into a collective movement by gamifying the process and rewarding positive environmental actions.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">Who Can Join?</h3>
          <p className="text-white text-sm mb-4">
            Anyone! Whether you're a student planting in your backyard, a farmer growing crops, or just someone trying to make a small difference—GreenPoint welcomes you. All you need is a plant, a camera, and a little bit of care for the planet.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">How Are Points Calculated?</h3>
          <p className="text-white text-sm mb-4">
            Our point system considers:
          </p>
          <ul className="list-disc list-inside mb-4 text-white text-sm">
            <li>Type of plant (e.g., trees may yield more points than small herbs)</li>
            <li>Growth stage (e.g., seedlings, mature plants)</li>
            <li>Rarity or environmental value</li>
            <li>User consistency (upload streaks or planting milestones)</li>
          </ul>
          <p className="text-white text-sm mb-4">
            We're constantly improving our algorithm to ensure fairness and environmental relevance.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">What Happens to My Data?</h3>
          <p className="text-white text-sm mb-4">
            We respect your privacy. Images are only used for classification purposes and are stored securely. No personal information is shared with third parties without your consent.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-2 text-green-500">Join the Movement</h3>
          <p className="text-white text-sm mb-4">
            With GreenPoint, every plant counts. Small actions, when done collectively, can lead to real, sustainable change. Start growing, keep sharing, and let technology turn your efforts into something greater.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;