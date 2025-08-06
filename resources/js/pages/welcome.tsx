import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold text-blue-600">📦 StockOpname PWA</div>
                        </div>
                        <div className="flex space-x-4">
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button>Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="outline">Login</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button>Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        📱 Mobile-First 
                        <span className="text-blue-600"> Inventory </span>
                        <span className="text-green-600">Stock Opname</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Streamline your inventory stock taking operations with our Progressive Web App. 
                        Scan QR codes, update quantities, and track progress in real-time across multiple projects.
                    </p>
                    
                    {auth.user ? (
                        <div className="space-y-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="text-lg px-8 py-4">
                                    🚀 Go to Dashboard
                                </Button>
                            </Link>
                            <p className="text-sm text-gray-500">Welcome back, {auth.user.name}!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="text-lg px-8 py-4">
                                        📝 Get Started Free
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                        🔐 Sign In
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-sm text-gray-500">Free trial • No credit card required</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                        🎯 Key Features
                    </h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* QR Code Scanning */}
                        <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">QR Code Scanning</h3>
                            <p className="text-gray-600">
                                Scan storage location QR codes to instantly access and update item quantities. 
                                Fast, accurate, and mobile-optimized.
                            </p>
                        </div>

                        {/* Manual Entry */}
                        <div className="p-6 rounded-xl bg-green-50 border border-green-200">
                            <div className="text-4xl mb-4">✏️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Manual Selection</h3>
                            <p className="text-gray-600">
                                Browse projects and parts manually. Select items and update quantities 
                                with an intuitive mobile-first interface.
                            </p>
                        </div>

                        {/* Progress Tracking */}
                        <div className="p-6 rounded-xl bg-purple-50 border border-purple-200">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Dashboard</h3>
                            <p className="text-gray-600">
                                Track stock taking progress in real-time. View completion percentages 
                                by project, weekly and monthly achievements.
                            </p>
                        </div>

                        {/* Role Management */}
                        <div className="p-6 rounded-xl bg-orange-50 border border-orange-200">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Role-Based Access</h3>
                            <p className="text-gray-600">
                                Admin, Stock Taker, and Viewer roles with appropriate permissions. 
                                Secure access control for different user types.
                            </p>
                        </div>

                        {/* Reporting */}
                        <div className="p-6 rounded-xl bg-red-50 border border-red-200">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Reports</h3>
                            <p className="text-gray-600">
                                Generate detailed reports with export capabilities. 
                                XLSX and PDF formats for comprehensive analysis.
                            </p>
                        </div>

                        {/* Excel Import */}
                        <div className="p-6 rounded-xl bg-teal-50 border border-teal-200">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Excel Integration</h3>
                            <p className="text-gray-600">
                                Upload master inventory data via Excel files. 
                                Seamless integration with existing workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stock Taking Process */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                        🔄 Stock Taking Process
                    </h2>
                    
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                1️⃣
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Setup Period</h3>
                            <p className="text-gray-600">Create weekly or monthly stock taking periods</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                2️⃣
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Scan or Select</h3>
                            <p className="text-gray-600">Use QR codes or manual selection to find items</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                3️⃣
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Count & Update</h3>
                            <p className="text-gray-600">Input counted quantities and add remarks</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                4️⃣
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Save & Report</h3>
                            <p className="text-gray-600">Save data and generate comprehensive reports</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Modernize Your Inventory?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of companies using our PWA for efficient stock taking operations.
                    </p>
                    
                    {auth.user ? (
                        <Link href="/dashboard">
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                                🎯 Start Stock Taking
                            </Button>
                        </Link>
                    ) : (
                        <div className="space-x-4">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                                    🚀 Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
                                    🔐 Sign In
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="text-xl font-semibold mb-2">📦 StockOpname PWA</div>
                    <p className="text-gray-400">Mobile-first inventory management solution</p>
                </div>
            </footer>
        </div>
    );
}