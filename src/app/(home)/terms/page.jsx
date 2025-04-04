import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mt-10 mx-auto bg-white p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8">
          Terms and Conditions
        </h1>

        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto">
          <p className="text-gray-600 mb-6">
            Welcome to our website. If you continue to browse and use this
            website, you are agreeing to comply with and be bound by the
            following terms and conditions of use, which together with our
            privacy policy govern our relationship with you in relation to this
            website.
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 mb-6">
            By accessing or using our website, you agree to be bound by these
            Terms and Conditions. If you do not agree to these terms, please do
            not use our website.
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
            2. Use of the Website
          </h2>
          <p className="text-gray-600 mb-6">
            The content of the pages of this website is for your general
            information and use only. It is subject to change without notice.
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
            3. Intellectual Property
          </h2>
          <p className="text-gray-600 mb-6">
            This website contains material which is owned by or licensed to us.
            This material includes, but is not limited to, the design, layout,
            look, appearance, and graphics. Reproduction is prohibited other
            than in accordance with the copyright notice, which forms part of
            these terms and conditions.
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-600 mb-6">
            Your use of any information or materials on this website is entirely
            at your own risk, for which we shall not be liable. It shall be your
            own responsibility to ensure that any products, services, or
            information available through this website meet your specific
            requirements.
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
            5. Changes to Terms
          </h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these terms and conditions at any
            time. By using this website, you agree to be bound by the current
            version of these Terms and Conditions.
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
            6. Governing Law
          </h2>
          <p className="text-gray-600 mb-6">
            Your use of this website and any dispute arising out of such use is
            subject to the laws of your country or region.
          </p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
            7. Contact Us
          </h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about these Terms and Conditions, please
            contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-500 hover:underline"
            >
              support@example.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
