export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 ">Terms & Conditions</h1>
      <div className="prose ">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Main Calculators, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use our calculators for personal, non-commercial 
          purposes only. This is the grant of a license, not a transfer of title.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          The calculators and tools provided on this website are for informational purposes only. 
          While we strive for accuracy, we make no warranties about the results or suitability 
          for any purpose.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall Main Calculators be liable for any damages arising out of the use 
          or inability to use the materials on our website.
        </p>

        <h2>5. Revisions</h2>
        <p>
          We may update these terms of service at any time without notice. By using this website, 
          you are agreeing to be bound by the current version of these terms of service.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about these Terms & Conditions, please contact us through 
          our contact page.
        </p>
      </div>
    </div>
  )
}
