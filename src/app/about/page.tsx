import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-blue-100 transform -skew-y-6"></div>
          <div className="absolute right-0 bottom-0 w-2/3 h-1/3 bg-blue-200 rounded-tl-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">About <span className="text-blue-600">Main Calculators</span></h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Providing powerful and intuitive calculation tools for everyone, from students to professionals since 2023.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="prose prose-lg">
                <p>
                  Main Calculators was founded with a simple yet powerful mission: to make complex calculations accessible 
                  to everyone. What began as a small project has grown into a comprehensive platform offering hundreds 
                  of specialized calculators.
                </p>
                <p>
                  We understand that whether you're planning your finances, working on scientific research, managing your health, 
                  or solving everyday mathematical problems, having reliable and easy-to-use tools is essential. That's why we've 
                  built our platform to be intuitive, accurate, and continuously improving.
                </p>
                <p>
                  Today, Main Calculators serves thousands of users globally, helping them make informed decisions and solve complex 
                  problems with just a few clicks.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <span className="block text-5xl font-bold mb-4">2023</span>
                  <p className="text-xl">Year Founded</p>
                  <div className="h-1 w-20 bg-white mx-auto my-6"></div>
                  <span className="block text-5xl font-bold mb-4">500+</span>
                  <p className="text-xl">Calculators</p>
                  <div className="h-1 w-20 bg-white mx-auto my-6"></div>
                  <span className="block text-5xl font-bold">50k+</span>
                  <p className="text-xl">Monthly Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission & Vision</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Empowering users with the tools they need to make informed decisions and solve complex problems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600">
                To provide accurate, accessible, and easy-to-use calculation tools that empower individuals and businesses to make 
                better decisions. We strive to simplify complex calculations across various domains, from finance to health, making 
                them accessible to everyone regardless of their technical expertise.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600">
                To become the world's leading platform for online calculators, trusted by millions for its accuracy, 
                ease of use, and comprehensive range of tools. We envision a future where anyone, anywhere, can instantly 
                access the calculation tools they need to solve problems, plan their future, and make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-slate-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                <div className={`h-2 ${category.color}`}></div>
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{category.title}</h3>
                  <p className="text-slate-600 mb-4">{category.description}</p>
                  <ul className="space-y-2 mb-6">
                    {category.examples.map((example, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="h-4 w-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={category.link} className="text-blue-600 font-medium hover:text-blue-800 transition duration-300">
                    View all {category.title.toLowerCase()} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-full ${value.bgColor} flex items-center justify-center mb-4`}>
                  <span className="text-white text-xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden hover:border-blue-200 transition duration-300">
                <h3 className="text-xl font-medium p-4 bg-slate-50 border-b border-slate-200">{faq.question}</h3>
                <div className="p-4 prose">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-300">
              Have more questions? Contact us
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start calculating?</h2>
          <p className="text-xl mb-8 opacity-90">Explore our wide range of calculators and make better decisions today.</p>
          <Link href="/" className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition duration-300 shadow-lg">
            Explore Our Calculators
          </Link>
        </div>
      </section>
    </div>
  );
}

// Data for the categories section
const categories = [
  {
    title: "Finance Calculators",
    description: "Plan your financial future with our comprehensive suite of financial calculators.",
    icon: "💰",
    color: "bg-green-500",
    bgColor: "bg-green-100 text-green-600",
    examples: ["Mortgage Calculator", "Investment Calculator", "Compound Interest Calculator", "Loan Calculator"],
    link: "/"
  },
  {
    title: "Health & Fitness",
    description: "Monitor and improve your health with our precision health and fitness calculators.",
    icon: "💪",
    color: "bg-blue-500",
    bgColor: "bg-blue-100 text-blue-600",
    examples: ["BMI Calculator", "Calorie Calculator", "Body Fat Calculator", "Macro Calculator"],
    link: "/"
  },
  {
    title: "Math & Science",
    description: "Solve complex mathematical and scientific problems with ease.",
    icon: "🧮",
    color: "bg-purple-500",
    bgColor: "bg-purple-100 text-purple-600",
    examples: ["Scientific Calculator", "Statistics Calculator", "Unit Converter", "Probability Calculator"],
    link: "/"
  }
];

// Data for the values section
const values = [
  {
    title: "Accuracy",
    description: "We are committed to providing precise calculations you can rely on for important decisions.",
    icon: "✓",
    bgColor: "bg-blue-600"
  },
  {
    title: "Accessibility",
    description: "We design our tools to be intuitive and accessible to users of all technical backgrounds.",
    icon: "🌐",
    bgColor: "bg-green-600"
  },
  {
    title: "Innovation",
    description: "We constantly improve our calculators and develop new tools to meet evolving needs.",
    icon: "💡",
    bgColor: "bg-purple-600"
  },
  {
    title: "Privacy",
    description: "We respect your privacy and ensure your data is secure when using our tools.",
    icon: "🔒",
    bgColor: "bg-red-600"
  }
];

// FAQ data
const faqs = [
  {
    question: "Are your calculators free to use?",
    answer: "Yes, all of our calculators are completely free to use. We believe in providing accessible tools to everyone without any barriers."
  },
  {
    question: "How accurate are your calculators?",
    answer: "We strive for the highest level of accuracy in all our calculators. Our tools are built using industry-standard formulas and are regularly tested and updated to ensure reliability."
  },
  {
    question: "Can I use your calculators on mobile devices?",
    answer: "Absolutely! Our website is fully responsive and designed to work seamlessly on desktops, tablets, and smartphones, allowing you to access our tools wherever you are."
  },
  {
    question: "Do you save the data I enter into the calculators?",
    answer: "We prioritize your privacy. The calculations are processed in your browser, and we do not store the specific data you enter into our calculators on our servers."
  }
];
