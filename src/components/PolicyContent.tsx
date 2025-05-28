
import React from 'react';

const PolicyContent = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you create an account, 
          use our services, or contact us for support. This may include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name and email address</li>
          <li>Account credentials</li>
          <li>Service requests and repair case information</li>
          <li>Communication preferences</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties 
          without your consent, except as described in this policy. We may share your information 
          in the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>With your explicit consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and safety</li>
          <li>With service providers who assist us in operating our platform</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against 
          unauthorized access, alteration, disclosure, or destruction. However, no method of 
          transmission over the internet is 100% secure.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access and update your personal information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of certain communications</li>
          <li>Request a copy of your data</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at 
          support@fixops.com or through our support channels.
        </p>
      </section>
    </div>
  );
};

export default PolicyContent;
