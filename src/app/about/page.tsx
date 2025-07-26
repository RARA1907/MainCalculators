import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            About <span className="text-blue-600">Main Calculators</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Providing powerful and intuitive calculation tools for everyone, from students to professionals since 2023.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600">
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
            <div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-2">2023</div>
                  <div className="text-sm opacity-90">Year Founded</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-sm opacity-90">Calculators</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">50k+</div>
                  <div className="text-sm opacity-90">Monthly Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">99.9%</div>
                  <div className="text-sm opacity-90">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission & Vision</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Empowering users with the tools they need to make informed decisions and solve complex problems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600">
                To provide accurate, accessible, and easy-to-use calculation tools that empower individuals and businesses to make 
                better decisions. We strive to simplify complex calculations across various domains, from finance to health, making 
                them accessible to everyone regardless of their technical expertise.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-4`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{category.title}</h3>
                <p className="text-slate-600 mb-4">{category.description}</p>
                <ul className="space-y-2 mb-4">
                  {category.examples.map((example, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                      {example}
                    </li>
                  ))}
                </ul>
                <Link href={category.link} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  View all {category.title.toLowerCase()} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className={`w-12 h-12 rounded-lg ${value.bgColor} flex items-center justify-center mb-4 mx-auto`}>
                  <span className="text-white text-lg">{value.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <h3 className="text-lg font-semibold p-6 bg-slate-50 border-b border-slate-200">{faq.question}</h3>
                <div className="p-6">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Have more questions? Contact us
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start calculating?</h2>
          <p className="text-lg text-blue-100 mb-8">Explore our wide range of calculators and make better decisions today.</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-colors">
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
    bgColor: "bg-green-100 text-green-600",
    examples: ["Mortgage Calculator", "Investment Calculator", "Compound Interest Calculator", "Loan Calculator"],
    link: "/"
  },
  {
    title: "Health & Fitness",
    description: "Monitor and improve your health with our precision health and fitness calculators.",
    icon: "💪",
    bgColor: "bg-blue-100 text-blue-600",
    examples: ["BMI Calculator", "Calorie Calculator", "Body Fat Calculator", "Macro Calculator"],
    link: "/"
  },
  {
    title: "Math & Science",
    description: "Solve complex mathematical and scientific problems with ease.",
    icon: "🧮",
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
