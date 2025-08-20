import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Globe, Award, Target, Heart, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Franchiseen',
  description: 'Learn about Franchiseen\'s mission to revolutionize franchise management through innovative technology and seamless operations.',
};

const stats = [
  { number: '10,000+', label: 'Franchises Managed' },
  { number: '50+', label: 'Countries Served' },
  { number: '99.9%', label: 'Uptime Guarantee' },
  { number: '24/7', label: 'Support Available' },
];

const values = [
  {
    icon: Target,
    title: 'Innovation First',
    description: 'We constantly push boundaries to deliver cutting-edge solutions that transform how franchises operate.',
  },
  {
    icon: Heart,
    title: 'Customer Obsessed',
    description: 'Every decision we make is driven by our commitment to delivering exceptional value to our customers.',
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'We\'re building a platform that empowers franchise success across every corner of the world.',
  },
  {
    icon: Zap,
    title: 'Speed & Efficiency',
    description: 'We believe in moving fast and breaking barriers to help our customers achieve their goals faster.',
  },
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    image: '/images/team/sarah-chen.jpg',
    bio: 'Former VP of Operations at McDonald\'s with 15+ years in franchise management.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO & Co-Founder',
    image: '/images/team/marcus-rodriguez.jpg',
    bio: 'Ex-Google engineer who led the development of scalable restaurant tech solutions.',
  },
  {
    name: 'Emily Watson',
    role: 'Head of Product',
    image: '/images/team/emily-watson.jpg',
    bio: 'Product leader with experience at Uber and DoorDash, specializing in marketplace platforms.',
  },
  {
    name: 'David Kim',
    role: 'Head of Engineering',
    image: '/images/team/david-kim.jpg',
    bio: 'Former Principal Engineer at Stripe, expert in building financial infrastructure at scale.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Revolutionizing
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}franchise management
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're building the future of franchise operations with cutting-edge technology, 
              seamless integrations, and unparalleled support to help franchise owners thrive.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" 
               style={{
                 clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
               }} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by franchise leaders worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Our platform powers thousands of successful franchises across the globe
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.number}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="overflow-hidden bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-blue-600">Our Mission</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Empowering franchise success through technology
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  We believe that every franchise owner deserves access to world-class tools and insights. 
                  Our mission is to democratize enterprise-grade franchise management technology, making it 
                  accessible and affordable for businesses of all sizes.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <Users className="absolute left-0 top-1 h-5 w-5 text-blue-600" />
                      People-first approach.
                    </dt>
                    <dd className="inline"> We put franchise owners and their teams at the center of everything we build.</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <Globe className="absolute left-0 top-1 h-5 w-5 text-blue-600" />
                      Global scale, local touch.
                    </dt>
                    <dd className="inline"> Our platform scales globally while maintaining the personal service you expect.</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <Award className="absolute left-0 top-1 h-5 w-5 text-blue-600" />
                      Excellence in execution.
                    </dt>
                    <dd className="inline"> We're committed to delivering exceptional quality in every aspect of our service.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex items-start justify-end lg:order-first">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-3"></div>
                <Image
                  src="/images/about/mission-image.jpg"
                  alt="Team collaboration"
                  width={600}
                  height={400}
                  className="relative rounded-2xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The principles that guide everything we do and every decision we make
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <value.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {value.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{value.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet our leadership</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experienced leaders from top tech companies and franchise organizations
            </p>
          </div>
          <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {team.map((person) => (
              <li key={person.name}>
                <div className="group relative">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={300}
                      height={400}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.name}</h3>
                  <p className="text-base leading-7 text-blue-600">{person.role}</p>
                  <p className="mt-4 text-base leading-7 text-gray-600">{person.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your franchise?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of successful franchise owners who trust Franchiseen to power their operations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/contact"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Get started today
              </Link>
              <Link
                href="/careers"
                className="text-sm font-semibold leading-6 text-white hover:text-blue-100 transition-colors"
              >
                Join our team <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
