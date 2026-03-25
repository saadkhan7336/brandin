import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import InfluButton from "../components/common/InfluBtn";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Shield,
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

export default function ContactPage() {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our team is here to help with your inquiries.",
      value: "support@brandly.com",
      color: "bg-[#eff6ff] text-[#3b82f6]",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Available Mon-Fri from 9am to 6pm.",
      value: "+1 (555) 000-0000",
      color: "bg-[#f0fdf4] text-[#10b981]",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our global headquarters.",
      value: "123 Innovation Way, San Francisco, CA",
      color: "bg-[#fff7ed] text-[#f59e0b]",
    },
  ];

  const faqs = [
    {
      question: "How do I get started as a brand?",
      answer:
        "Simply create an account, complete your profile, and you can start searching for influencers or create your first campaign immediately.",
    },
    {
      question: "Is there a cost for influencers to join?",
      answer:
        "Joining Brandly as an influencer is completely free. We take a small commission only when you successfully complete a collaboration.",
    },
    {
      question: "How are payments handled?",
      answer:
        "We use a secure escrow system. Brands pay when the collaboration starts, and funds are released to influencers once the work is approved.",
    },
    {
      question: "What if I need help with my campaign?",
      answer:
        "Our dedicated support team and campaign managers are available to assist you at every step of your influencer marketing journey.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdf4]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-[#dbeafe] text-[#3b82f6] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Contact Us
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] mb-6">
                Let's Start a <br />
                <span className="text-[#3b82f6]">Conversation</span>
              </h1>
              <p className="text-xl text-[#6b7280] mb-8 leading-relaxed">
                Have questions about our platform or interested in working with
                us? Our team is here to help you navigate the world of
                influencer marketing.
              </p>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${method.color}`}
                    >
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111827]">
                        {method.title}
                      </h3>
                      <p className="text-sm text-[#6b7280] mb-1">
                        {method.description}
                      </p>
                      <p className="text-[#3b82f6] font-semibold">
                        {method.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-bold text-[#111827] mb-4 uppercase tracking-wider">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 rounded-lg border border-[#e5e7eb] flex items-center justify-center text-[#6b7280] hover:text-[#3b82f6] hover:border-[#3b82f6] transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e5e7eb] shadow-xl">
                <h2 className="text-2xl font-bold text-[#111827] mb-8">
                  Send us a message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#374151]">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#374151]">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      How can we help?
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white">
                      <option>General Inquiry</option>
                      <option>Brand Support</option>
                      <option>Influencer Support</option>
                      <option>Partnership Interest</option>
                      <option>Press & Media</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#374151]">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                  <InfluButton variant="primary" size="lg" className="w-full">
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </InfluButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[#6b7280]">
              Quick answers to some of the most common questions we receive.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-[#e5e7eb] hover:border-[#3b82f6] transition-all group"
              >
                <button className="w-full flex items-center justify-between text-left">
                  <h3 className="text-lg font-bold text-[#111827] group-hover:text-[#3b82f6] transition-colors">
                    {faq.question}
                  </h3>
                  <MessageSquare className="w-5 h-5 text-[#6b7280] group-hover:text-[#3b82f6]" />
                </button>
                <p className="mt-4 text-[#6b7280] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-[#6b7280] mb-4">Still have questions?</p>
            <InfluButton
              variant="outline"
              onClick={() => navigate("/help-center")}
            >
              Visit our Help Center
              <ArrowRight className="w-4 h-4 ml-2" />
            </InfluButton>
          </div>
        </div>
      </section>

      {/* Map or Office Section */}
      <section className="py-20 bg-[#f9fafb] px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111827] mb-12">
            Our Global Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                city: "San Francisco",
                address: "123 Innovation Way",
                state: "CA 94103, USA",
              },
              {
                city: "London",
                address: "45 Tech Plaza",
                state: "EC2A 4NE, UK",
              },
              {
                city: "Tokyo",
                address: "7-1 Digital Street",
                state: "Minato-ku, Japan",
              },
            ].map((office, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#e5e7eb]"
              >
                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  {office.city}
                </h3>
                <p className="text-[#6b7280]">{office.address}</p>
                <p className="text-[#6b7280]">{office.state}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-[#e5e7eb] px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#3b82f6]" />
            <span className="text-xl font-bold text-[#111827]">Brandly</span>
          </div>
          <div className="text-[#6b7280] text-sm">
            &copy; 2024 Brandly. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-medium text-[#6b7280]">
            <button className="hover:text-[#3b82f6]">Privacy Policy</button>
            <button className="hover:text-[#3b82f6]">Terms of Service</button>
            <button className="hover:text-[#3b82f6]">Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
