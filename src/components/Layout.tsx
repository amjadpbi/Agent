import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Database, MessageSquare, Menu } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: Home },
        { name: 'Process Bill', path: '/process', icon: FileText },
        { name: 'Ledger Schema', path: '/schema', icon: Database },
        { name: 'Business Data', path: '/data', icon: Database },
        { name: 'Ask ShopAgent', path: '/agent', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Mobile/Desktop Sidebar (desktop static, mobile hidden/drawer in a full app, but keeping simple for MVP) */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        ShopAgent
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Business Intelligence</p>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${active
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
                    MVP Demo - Hackathon
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header component */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
                    <h1 className="text-xl font-bold text-blue-600">ShopAgent</h1>
                    <Menu className="text-slate-600 w-6 h-6" />
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
