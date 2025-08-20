import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Users, Zap, Heart, Globe, Award, Coffee, Gamepad2, Plane, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers - Join Our Team | Franchiseen',
  description: 'Join Franchiseen and help revolutionize franchise management. Explore exciting career opportunities in a fast-growing fintech company.',
};

const openRoles = [
  {
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote / London',
    type: 'Full-time',
    description: 'Build scalable web applications using React, Node.js, and modern cloud technologies.',
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    description: 'Drive product strategy and execution for our franchise management platform.',
  },
  {
    title: 'Senior DevOps Engineer',
    department: 'Engineering',
    location: 'Remote / Berlin',
    type: 'Full-time',
    description: 'Scale our infrastructure and improve deployment processes across global markets.',
  },
  {
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote / New York',
    type: 'Full-time',
    description: 'Create intuitive and beautiful user experiences for franchise owners and operators.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote / Austin',
    type: 'Full-time',
    description: 'Help our customers achieve success with our platform and drive product adoption.',
  },
  {
    title: 'Data Scientist',
    department: 'Data',
    location: 'Remote / Toronto',
    type: 'Full-time',
    description: 'Analyze franchise performance data and build predictive models for business insights.',
  },
];

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance, mental health support, and wellness stipends.',
  },
  {
    icon: Plane,
    title: 'Flexible Time Off',
    description: 'Unlimited PTO policy and company-wide wellness weeks throughout the year.',
  },
  {
    icon: GraduationCap,
    title: 'Learning & Development',
    description: '$2,000 annual learning budget and access to top-tier conferences and courses.',
  },
  {
    icon: Coffee,
    title: 'Remote-First Culture',
    description: 'Work from anywhere with home office setup stipend and co-working allowances.',
  },
  {
    icon: Gamepad2,
    title: 'Team Building',
    description: 'Regular team events, hackathons, and annual company retreats in amazing locations.',
  },
  {
    icon: Award,
    title: 'Equity & Growth',
    description: 'Competitive equity packages and clear career progression paths.',
  },
];

const values = [
  {
    icon: Zap,
    title: 'Move Fast',
    description: 'We ship quickly, iterate rapidly, and aren\'t afraid to break things in pursuit of excellence.',
  },
  {
    icon: Users,
    title: 'Customer Obsessed',
    description: 'Every decision starts with our customers. We build products they love and need.',
  },
  {
    icon: Globe,
    title: 'Think Global',
    description: 'We\'re building for the world, considering diverse markets and use cases from day one.',
  },
  {
    icon: Heart,
    title: 'Care Deeply',
    description: 'We care about our work, our teammates, and the impact we have on the world.',
  },
];

const stats = [
  { number: '150+', label: 'Team Members' },
  { number: '25+', label: 'Countries' },
  { number: '4.9/5', label: 'Glassdoor Rating' },
  { number: '95%', label: 'Employee Satisfaction' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Build the future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {' '}franchise technology
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join our mission to revolutionize how franchises operate. Work with cutting-edge technology, 
              solve complex problems, and make a real impact on businesses worldwide.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="#open-roles"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                View open roles
              </Link>
              <Link
                href="#culture"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              >
                Learn about our culture <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
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
                Join a world-class team
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                We're building something special with talented people from around the globe
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

      {/* Values Section */}
      <section id="culture" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The principles that guide how we work, make decisions, and treat each other
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

      {/* Benefits Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Benefits & Perks
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We believe in taking care of our team so they can do their best work
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex flex-col items-center text-center">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <benefit.icon className="h-8 w-8 flex-none text-blue-600 mb-4" aria-hidden="true" />
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="flex-auto">{benefit.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="open-roles" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Open Positions</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Find your next opportunity and help us build the future of franchise management
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {openRoles.map((role) => (
                <div key={role.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                      <div className="mt-2 flex items-center gap-x-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-x-1">
                          <Users className="h-4 w-4" />
                          {role.department}
                        </span>
                        <span className="inline-flex items-center gap-x-1">
                          <MapPin className="h-4 w-4" />
                          {role.location}
                        </span>
                        <span className="inline-flex items-center gap-x-1">
                          <Clock className="h-4 w-4" />
                          {role.type}
                        </span>
                      </div>
                      <p className="mt-4 text-gray-600">{role.description}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/careers/${role.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center gap-x-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Don't see the right role?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="mailto:careers@franchiseen.com"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Get in touch
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-white hover:text-blue-100 transition-colors"
              >
                Learn more about us <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
