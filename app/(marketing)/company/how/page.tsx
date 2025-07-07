import { SignedOut } from '@clerk/nextjs';
import { SquareCheck } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

function HowItWorkPage() {
  return (
    <>
      {/* Section 1 */}
      <section className="dark:bg-stone-800 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between min-h-[70vh]">
          {/* Left: Text Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white text-gray-900">
            The Franchise Engine
            </h1>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start gap-2 text-base dark:text-white text-gray-800">
                <SquareCheck className="w-5 h-5 text-stone-500 mt-1" />
                <b>Create Franchise:</b> Select a brand and location to start a new franchise.
              </li>
              <li className="flex items-start gap-2 text-base dark:text-white text-gray-800">
              <SquareCheck className="w-5 h-5 text-stone-500 mt-1" />

                <b>Fund Franchise:</b> Members can buy shares and fund franchise growth.
              </li>
              <li className="flex items-start gap-2 text-base dark:text-white text-gray-800">
              <SquareCheck className="w-5 h-5 text-stone-500 mt-1" />

                <b>Earn or Sell:</b> Members can earn from franchise profits or sell thier shares.
              </li>
            </ul>
            {/* <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-2 text-lg dark:text-white text-gray-800">
                <span className="text-green-500 mt-1">✔️</span>
                Simple to use, beautiful UI design
              </li>
              <li className="flex items-start gap-2 text-lg dark:text-white text-gray-800">
                <span className="text-green-500 mt-1">✔️</span>
                Complete complex project with ease
              </li>
              <li className="flex items-start gap-2 text-lg dark:text-white text-gray-800">
                <span className="text-green-500 mt-1">✔️</span>
                An intuitive admin app for developers
              </li>
            </ul> */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <SignedOut>
                <button className="bg-yellow-600 hover:bg-stone-800 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow transition">
                  Get started for Free
                </button>
              </SignedOut>
              
              <a href="#" className="text-yellow-700 underline text-base font-medium">
                Questions? Talk to an expert
              </a>
            </div>
          </div>
          {/* Right: Illustration */}
          <div className="mt-12 md:mt-0 md:ml-12 flex-1 flex items-center justify-center">
            <Image src="/graphics/1.svg" alt="How it works" width={700} height={700} />
          </div>
        </div>
      </section>

      {/* Section 2: Image Left, Text Right */}
      <section className="bg-white dark:bg-stone-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left: Illustration */}
          <div className="flex-1 flex items-center justify-center mb-12 md:mb-0">
              <Image src="/graphics/2.svg" alt="Franchisee" width={700} height={700} className="rounded-4xl" />
          </div>
          {/* Right: Text Content */}
          <div className="flex-1 max-w-xl md:ml-12">
            <div className="uppercase text-sm font-semibold text-yellow-600 mb-2 tracking-wider">What is a Franchisee?</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white text-gray-900">
              Invest in Franchises
            </h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Franchisees are users like you who invest in franchise businesses listed on our platform. You can own a share of a real business, earn monthly payouts, and diversify your investments with ease.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Invest in vetted franchises
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Earn passive income every month
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Start with low minimums
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Track your investments easily
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Join a community of investors
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Get support from our team
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Text Left, Image Right */}
      <section className="bg-white dark:bg-stone-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-xl md:mr-12 order-2 md:order-1">
            <div className="uppercase text-sm font-semibold text-yellow-600 mb-2 tracking-wider">What is a Franchisor?</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white text-gray-900">
              Businesses Behind Brands
            </h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Franchisors are the businesses who run and grow the franchise brands you can invest in. They provide the systems, support, and opportunities for investors to participate in their success.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Expand brand reach
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Consistent operations
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Training programs
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Marketing resources
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Ongoing support
                </li>
                <li className="flex items-center gap-2 text-base text-gray-800 dark:text-white">
                  <span className="text-green-500">✔️</span> Network growth
                </li>
              </ul>
            </div>
          </div>
          {/* Right: Illustration */}
          <div className="flex-1 flex items-center justify-center order-1 md:order-2 mb-12 md:mb-0">
              <Image src="/graphics/3.svg" alt="Franchisor" width={700} height={700} className="rounded-4xl" />
          </div>
        </div>
      </section>

      {/* Section 4: Three Features in a Row */}
      <section className="bg-gray-50 dark:bg-stone-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage, grow, and succeed with your franchise investments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Crowdfunding */}
            <div className="flex flex-col items-center text-center bg-white dark:bg-stone-800 rounded-4xl p-8">
              <Image src="/graphics/4.svg" alt="Crowdfunding" width={300} height={300} className="mb-6 rounded-4xl" />
              <h3 className="text-xl font-semibold mb-3 dark:text-white text-gray-900">Crowdfunding</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Pool resources with others to invest in promising franchise opportunities and diversify your portfolio easily.
              </p>
            </div>
            {/* Monthly Payouts */}
            <div className="flex flex-col items-center text-center bg-white dark:bg-stone-800 rounded-4xl p-8">
              <Image src="/graphics/5.svg" alt="Monthly Payouts" width={300} height={300} className="mb-6 rounded-4xl" />
              <h3 className="text-xl font-semibold mb-3 dark:text-white text-gray-900">Monthly Payouts</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Receive automated monthly earnings from your investments, with transparent reporting and easy tracking.
              </p>
            </div>
            {/* Franchise Portfolio */}
            <div className="flex flex-col items-center text-center bg-white dark:bg-stone-800 rounded-4xl p-8">
              <Image src="/graphics/6.svg" alt="Franchise Portfolio" width={300} height={300} className="mb-6 rounded-4xl" />
              <h3 className="text-xl font-semibold mb-3 dark:text-white text-gray-900">Franchise Portfolio</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Manage all your franchise investments in one place, monitor performance, and make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: How to Get Started */}
      <section className="bg-white dark:bg-stone-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-4">Get Started in 4 Easy Steps</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Follow these four simple steps to start investing in franchises and earning revenue.
            </p>
          </div>
          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 order-2 md:order-1">
                <div className="flex items-center mb-4 ml-6">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-600 font-bold text-xl mr-4">1</span>
                  <h3 className="text-2xl font-semibold dark:text-white text-gray-900">Create an account</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 ml-6">
                  Sign up quickly and securely to access the platform and start your investment journey.
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center order-1 md:order-2">
                <Image src="/graphics/7.svg" alt="Create an account" width={500} height={500} className="rounded-4xl" />
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 flex items-center justify-center mb-8 md:mb-0">
                <Image src="/graphics/8.svg" alt="Choose franchise" width={500} height={500} className="rounded-4xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-4 mr-6">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-600 font-bold text-xl mr-4">2</span>
                  <h3 className="text-2xl font-semibold dark:text-white text-gray-900">Choose which franchise you want to invest</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 mr-6">
                  Browse and select from a variety of vetted franchises that match your interests and goals.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 order-2 md:order-1">
                <div className="flex items-center mb-4 ml-6">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-600 font-bold text-xl mr-4">3</span>
                  <h3 className="text-2xl font-semibold dark:text-white text-gray-900">Watch the franchise earn</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 ml-6">
                  Track your investment performance in real time as your chosen franchise generates revenue.
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center order-1 md:order-2">
                <Image src="/graphics/9.svg" alt="Watch the franchise earn" width={500} height={500} className="rounded-4xl" />
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 flex items-center justify-center mb-8 md:mb-0">
                <Image src="/graphics/10.svg" alt="Get the money revenue" width={500} height={500} className="rounded-4xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-4 mr-6">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-600 font-bold text-xl mr-4">4</span>
                  <h3 className="text-2xl font-semibold dark:text-white text-gray-900">Get the money revenue in your account</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 mr-6">
                  Enjoy automated payouts as your share of the franchise revenue is deposited directly into your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action: Newsletter Signup */}
      <section className="bg-stone-50 dark:bg-stone-900 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white-900 dark:text-white-100">Stay in the Loop!</h2>
          <p className="text-lg text-white-800 dark:text-white-200 mb-8">Sign up to get the latest franchise opportunities, platform updates, and tips delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg border border-white-300 dark:border-white-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-white-700 dark:text-white-200 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}

export default HowItWorkPage;