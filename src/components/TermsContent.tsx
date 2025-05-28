
import React from 'react';

const TermsContent = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
        <p>
          By accessing and using FixOps, you accept and agree to be bound by the terms and 
          provision of this agreement. If you do not agree to abide by the above, please do 
          not use this service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily use FixOps for personal, non-commercial 
          transitory viewing only. This is the grant of a license, not a transfer of title, 
          and under this license you may not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to reverse engineer any software contained on the platform</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">User Accounts</h2>
        <p className="mb-4">
          When you create an account with us, you must provide information that is accurate, 
          complete, and current at all times. You are responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use of your account</li>
          <li>Ensuring your contact information is up to date</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Service Availability</h2>
        <p>
          FixOps strives to provide reliable service, but we do not guarantee that the service 
          will be uninterrupted or error-free. We reserve the right to modify, suspend, or 
          discontinue the service at any time without notice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Prohibited Uses</h2>
        <p className="mb-4">You may not use our service:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>For any unlawful purpose or to solicit others to unlawful acts</li>
          <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
          <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
          <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
          <li>To submit false or misleading information</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
        <p>
          In no event shall FixOps or its suppliers be liable for any damages (including, 
          without limitation, damages for loss of data or profit, or due to business interruption) 
          arising out of the use or inability to use the service, even if FixOps or a FixOps 
          authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws 
          and any disputes relating to these terms will be subject to the exclusive jurisdiction 
          of the courts.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at 
          legal@fixops.com or through our support channels.
        </p>
      </section>
    </div>
  );
};

export default TermsContent;
