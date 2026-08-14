import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, TrendingUp, Users, Package, Database, MessageSquare } from 'lucide-react';
import { useAppContext } from '../lib/store';

export default function Dashboard() {
    const { invoices } = useAppContext();

    // Basic Stats
    const totalBills = invoices.length;

    const uniqueSuppliers = new Set(invoices.map(i => i.supplierId)).size;

    let totalValue = 0;
    const uniqueProducts = new Set<string>();

    invoices.forEach(inv => {
        totalValue += inv.totalAmount;
        inv.items.forEach(item => uniqueProducts.add(item.productId));
    });

    const formattedTotal = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(totalValue);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header section representing the overall concept */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-70"></div>
                <div className="relative z-10 w-full md:w-2/3">
                    <h2 className="text-3xl font-bold text-slate-800">Turn supplier bills into business intelligence.</h2>
                    <p className="mt-4 text-slate-600">
                        Upload photos of your invoices, automatically extract the line items into Excel-ready structures, and ask ShopAgent for business insights.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link to="/process" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm hover:shadow">
                            <FileText className="w-5 h-5 mr-2" />
                            Process a Bill
                        </Link>
                        <Link to="/agent" className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-xl border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition shadow-sm hover:shadow">
                            Ask ShopAgent
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Bills Processed', value: totalBills, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Suppliers', value: uniqueSuppliers, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { label: 'Products Tracker', value: uniqueProducts.size, icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Total Value (PKR)', value: formattedTotal, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50', isValueWide: true },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                            <div className={`p-3 rounded-lg inline-flex w-12 h-12 items-center justify-center ${stat.bg}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="mt-4">
                                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                                <div className={`mt-1 font-bold text-slate-800 ${stat.isValueWide ? 'text-xl md:text-2xl' : 'text-3xl'}`}>
                                    {stat.value}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>

            {/* Process Flow Visual Explanation */}
            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">How it works</h3>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 text-center">

                    <div className="flex flex-col items-center flex-1">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300">
                            <FileText className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="mt-4 font-semibold text-slate-700">1. Bill</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-[150px]">Upload paper invoice</p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />

                    <div className="flex flex-col items-center flex-1">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200">
                            <Database className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="mt-4 font-semibold text-slate-700">2. Structured Data</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-[150px]">Mapped to spreadsheet</p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />

                    <div className="flex flex-col items-center flex-1">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center border-2 border-purple-200">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <p className="mt-4 font-semibold text-slate-700">3. Business Intel</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-[150px]">Historical tracking</p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />

                    <div className="flex flex-col items-center flex-1">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center border-2 border-indigo-200 shadow-inner">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400 blur-sm rounded-full opacity-50 animation-pulse"></div>
                                <MessageSquare className="w-6 h-6 text-indigo-600 relative z-10" />
                            </div>
                        </div>
                        <p className="mt-4 font-semibold text-indigo-700">4. Agent Decision</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-[150px]">Ask ShopAgent for insights</p>
                    </div>

                </div>
            </section>

        </div>
    );
}
