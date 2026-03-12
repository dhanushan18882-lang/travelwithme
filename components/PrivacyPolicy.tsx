import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail } from 'lucide-react';
import { Page } from '../types';

interface PrivacyPolicyProps {
    onNavigate: (page: Page) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('contact')}
                    className="group flex items-center gap-2 text-stone-600 hover:text-primary-600 transition-colors mb-8"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Contact</span>
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
                    <header className="mb-12 border-b border-stone-100 pb-8">
                        <div className="flex items-center gap-3 text-primary-600 mb-4">
                            <Shield size={32} />
                            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 font-medium">Privacy Policy</h1>
                        </div>
                        <p className="text-stone-500">Effective Date: March 10, 2026</p>
                    </header>

                    <div className="prose prose-stone max-w-none space-y-10">
                        <section>
                            <p className="text-lg text-stone-600 leading-relaxed">
                                At <strong className="text-stone-900">TravelWithMe</strong>, we are committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4 text-stone-900">
                                <FileText size={24} className="text-primary-500" />
                                <h2 className="text-2xl font-serif font-bold m-0">1. Information We Collect</h2>
                            </div>
                            <p className="text-stone-600 leading-relaxed mb-4">
                                When you fill out our contact form, we collect the following personal information:
                            </p>
                            <ul className="space-y-3 text-stone-600">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0"></span>
                                    <span><strong className="text-stone-800">Name:</strong> To address you personally in our communications.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0"></span>
                                    <span><strong className="text-stone-800">Email Address:</strong> To send you travel proposals and respond to your inquiries.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0"></span>
                                    <span><strong className="text-stone-800">Phone Number (Optional):</strong> To contact you regarding your travel plans if requested.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0"></span>
                                    <span><strong className="text-stone-800">Travel Preferences:</strong> Information about your interested destinations and travel messages to help us plan your dream trip.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4 text-stone-900">
                                <Eye size={24} className="text-primary-500" />
                                <h2 className="text-2xl font-serif font-bold m-0">2. How We Use Your Information</h2>
                            </div>
                            <p className="text-stone-600 leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="space-y-3 text-stone-600 font-medium">
                                <li className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
                                    <div className="w-8 h-8 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm">1</div>
                                    <span>Provide customized travel proposals and information.</span>
                                </li>
                                <li className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
                                    <div className="w-8 h-8 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm">2</div>
                                    <span>Communicate with you about your inquiries.</span>
                                </li>
                                <li className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
                                    <div className="w-8 h-8 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm">3</div>
                                    <span>Improve our services and customer experience.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4 text-stone-900">
                                <Lock size={24} className="text-primary-500" />
                                <h2 className="text-2xl font-serif font-bold m-0">3. Data Security</h2>
                            </div>
                            <p className="text-stone-600 leading-relaxed">
                                We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure.
                                However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
                            <h2 className="text-xl font-bold text-primary-900 mb-4 m-0">Contact Us</h2>
                            <p className="text-primary-800 mb-6 m-0">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Email</p>
                                        <p className="text-stone-900 font-medium">travelwithmeslk@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Address</p>
                                        <p className="text-stone-900 font-medium text-sm leading-tight">No. 123, Galle Road, Colombo 03, SL</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <p className="text-sm text-stone-400 italic text-center pt-8 border-t border-stone-100">
                            By using our contact form, you agree to the collection and use of your information as described in this policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
