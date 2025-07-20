import React from "react";

const TransactionFees = () => {
  return (
    <section className="bg-crypto-dark-blue min-h-screen py-12 px-4 md:px-16 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-gradient bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Low Transaction Fees on TraDify
        </h1>

        <p className="mb-4 text-lg text-gray-300">
          At <span className="text-crypto-bright-teal font-semibold">TraDify</span>, we pride ourselves on offering transparent and competitive transaction fees to help users maximize their trading experience and retain more value across their digital asset operations.
        </p>

        <div className="bg-[#0b132b] rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">🔄 Crypto Token Swaps</h2>
          <p className="text-gray-300">
            Enjoy token swaps with minimal slippage and fees starting as low as <span className="text-teal-400 font-semibold">0.1%</span> per transaction. Whether you're trading Bitcoin for Ethereum or exploring altcoins, our system ensures optimal routing with market-friendly rates.
          </p>
        </div>

        <div className="bg-[#0b132b] rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">💸 Withdrawals</h2>
          <p className="text-gray-300">
            User withdrawals are processed securely with only network-adjusted fees, ensuring you retain maximum value. We don't add hidden fees, making TraDify a preferred platform for fast, secure withdrawals across borders.
          </p>
        </div>

        <div className="bg-[#0b132b] rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">💰 Deposit Fees (for fiat and large crypto)</h2>
          <p className="text-gray-300 mb-2">
            While standard crypto deposits are free, fiat or large crypto deposits incur flat charges to sustain liquidity and buffer market fluctuations:
          </p>
          <ul className="list-disc list-inside text-gray-200">
            <li>Deposits above <span className="font-semibold text-teal-400">$500</span> attract a fee of <span className="font-semibold text-blue-400">$8</span></li>
            <li>Deposits above <span className="font-semibold text-teal-400">$2,000</span> attract a fee of <span className="font-semibold text-blue-400">$35</span></li>
            <li>Deposits above <span className="font-semibold text-teal-400">$5,000</span> attract a fee of <span className="font-semibold text-blue-400">$50</span></li>
          </ul>
        </div>

        <div className="bg-[#0b132b] rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">🌐 Policy Compliance & Governance</h2>
          <p className="text-gray-300">
            As a Web 2 platform, TraDify adheres to each user's country-specific financial and regulatory frameworks. This includes compliance with tax obligations, reporting requirements, and anti-money laundering (AML) statutes as defined by respective jurisdictions.
          </p>
        </div>

        <div className="bg-[#0b132b] rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">🛡️ AML Policy for High-Volume Deposits</h2>
          <p className="text-gray-300">
            Users depositing over <span className="font-semibold text-teal-400">$10,000</span> in crypto are strongly encouraged to review our <a href="/aml" className="underline text-blue-400 hover:text-blue-600 transition">AML Policy</a>. This is part of our global effort to ensure financial integrity and user protection.
          </p>
        </div>

        <div className="text-center mt-10">
          <a
            href="/create-account"
            className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 px-8 py-4 text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Create Your Account
          </a>
        </div>
      </div>
    </section>
  );
};

export default TransactionFees;
