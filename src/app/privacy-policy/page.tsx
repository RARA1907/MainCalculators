export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when using our calculators 
          or contacting us. This may include:
        </p>
        <ul>
          <li>Usage data and calculations</li>
          <li>Contact information when you reach out to us</li>
          <li>Technical information about your device and browser</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide and improve our calculator services</li>
          <li>Respond to your requests and questions</li>
          <li>Analyze and improve our website performance</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your 
          personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through 
          our contact page.
        </p>
      </div>
    </div>
  )
}
