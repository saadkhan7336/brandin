import React, { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // User mentioned backend email service is ready, usually this is under /contact or /email/send
      // If the backend route is different, it can be easily updated here.
      await api.post('/support/contact', formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "General Inquiry",
        message: ""
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our team is here to help with your inquiries.",
      value: "support@brandly.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Available Mon-Fri from 9am to 6pm.",
      value: "+1 (555) 000-0000",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our global headquarters.",
      value: "123 Innovation Way, San Francisco, CA",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans">
      <LandingNavbar />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        {/* Left Sidebar Info */}
        <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-32 h-fit">
          <header className="mb-12">
            <h1 className="text-5xl font-black tracking-tight leading-[1.1] mb-6">
              <span className="text-[#0f172a] block">Let's Start a</span>
              <span className="text-blue-600 block">Conversation.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Have questions about our platform or interested in working with us? We're here to help.
            </p>
          </header>

          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-600">
                  <method.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] mb-1">{method.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                  <p className="text-sm font-semibold text-blue-600">{method.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 hidden lg:block">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all bg-white"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Content - Form */}
        <div className="flex-1 max-w-3xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-[#0f172a]">Send us a message</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-gray-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">How can we help?</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-gray-50/50 appearance-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Brand Support">Brand Support</option>
                  <option value="Influencer Support">Influencer Support</option>
                  <option value="Partnership Interest">Partnership Interest</option>
                  <option value="Press & Media">Press & Media</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-gray-50/50 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                {!isSubmitting && <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
