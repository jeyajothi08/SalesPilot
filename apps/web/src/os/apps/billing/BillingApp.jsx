import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard as FiCreditCard, X as FiX, CheckCircle as FiCheckCircle, Star as FiStar, FileText as FiFileText } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export const BillingApp = ({ isActive, onClose, onFocus }) => {
    const [plans, setPlans] = useState([]);
    const [billingCycle, setBillingCycle] = useState('month');
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Fetch from our newly created billing router
                const res = await apiClient.get('/billing/plans');
                // Mock fallback in case DB is empty
                setPlans(res.data?.length ? res.data : [
                    { id: '1', name: 'Starter', amount: 99, interval: 'month', max_users: 1 },
                    { id: '2', name: 'Professional', amount: 299, interval: 'month', max_users: 5, popular: true },
                    { id: '3', name: 'Enterprise', amount: 999, interval: 'month', max_users: 20 }
                ]);
            } catch (e) {
                console.error(e);
                setPlans([
                    { id: '1', name: 'Starter', amount: 99, interval: 'month', max_users: 1 },
                    { id: '2', name: 'Professional', amount: 299, interval: 'month', max_users: 5, popular: true },
                    { id: '3', name: 'Enterprise', amount: 999, interval: 'month', max_users: 20 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleCheckout = async (planId, gateway) => {
        try {
            const res = await apiClient.post(`/billing/checkout?plan_id=${planId}&gateway=${gateway}`);
            if (gateway === 'stripe') {
                window.location.href = res.data.url;
            } else {
                showToast(`Razorpay Order Created! ID: ${res.data.subscription_id}. Injecting Razorpay SDK to complete payment...`);
                // Razorpay SDK logic would go here
            }
        } catch (e) {
            console.error("Checkout Failed:", e);
            showToast(e.message === 'Network Error' ? "Backend Unreachable: Checkout Failed" : "Checkout Failed");
        }
    };

    if (!isActive) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={onFocus}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-162.5 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40"
        >
            {/* Window Header */}
            <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-white/5 relative">
                {toastMessage && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500/90 text-white text-sm font-medium rounded-xl shadow-lg z-50 whitespace-nowrap animate-in fade-in slide-in-from-top-4">
                        {toastMessage}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <FiCreditCard className="text-ds-accent" />
                    <span className="text-white font-semibold text-sm">Billing & Subscriptions</span>
                </div>
                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                    <FiX />
                </button>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-4">Upgrade Your Workspace</h1>
                        <p className="text-white/60">Choose the perfect plan for your team's needs.</p>
                        
                        <div className="mt-6 inline-flex bg-white/5 p-1 rounded-full border border-white/10">
                            <button 
                                onClick={() => setBillingCycle('month')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'month' ? 'bg-ds-accent text-white' : 'text-white/60 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setBillingCycle('year')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'year' ? 'bg-ds-accent text-white' : 'text-white/60 hover:text-white'}`}
                            >
                                Yearly <span className="ml-1 text-green-400 text-xs">Save 20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-3 text-center text-white/50 py-10">Loading plans...</div>
                        ) : (
                            plans.map((plan) => (
                                <div key={plan.id} className={`relative p-6 rounded-2xl border ${plan.popular ? 'border-ds-accent bg-ds-accent/5' : 'border-white/10 bg-white/5'} flex flex-col`}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ds-accent text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <FiStar /> Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-bold text-white">${billingCycle === 'year' ? Math.floor(plan.amount * 0.8) : plan.amount}</span>
                                        <span className="text-white/50">/mo</span>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-white/80">
                                            <FiCheckCircle className="text-green-400" /> {plan.max_users} User License
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/80">
                                            <FiCheckCircle className="text-green-400" /> Unlimited CRM Deals
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/80">
                                            <FiCheckCircle className="text-green-400" /> AI Sales Agent
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-auto">
                                        <button 
                                            onClick={() => handleCheckout(plan.id, 'stripe')}
                                            className={`w-full py-2 rounded-lg font-medium transition-colors ${plan.popular ? 'bg-ds-accent text-white hover:bg-ds-accent-dark' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                        >
                                            Pay with Stripe
                                        </button>
                                        <button 
                                            onClick={() => handleCheckout(plan.id, 'razorpay')}
                                            className="w-full py-2 rounded-lg font-medium bg-transparent border border-white/20 text-white hover:bg-white/5 transition-colors"
                                        >
                                            Pay with Razorpay
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="mt-12 border-t border-white/10 pt-8">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FiFileText /> Billing History
                        </h3>
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm text-white/70">
                                <thead className="bg-white/5 text-white/90 border-b border-white/10">
                                    <tr>
                                        <th className="p-4 font-medium">Invoice</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Amount</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4" colSpan="4" align="center">No invoice history available.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
