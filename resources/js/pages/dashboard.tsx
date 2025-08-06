import React from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Stats {
    total_items: number;
    counted_items: number;
    weekly_progress: number;
    monthly_records: number;
    yearly_records: number;
}

interface Period {
    id: number;
    name: string;
    type: string;
    start_date: string;
    end_date: string;
}

interface Activity {
    id: number;
    item_name: string;
    part_number: string;
    storage: string;
    user_name: string;
    method: string;
    counted_at: string;
    qty_std: number;
    qty_sisa: number;
}

interface Project {
    name: string;
    total_items: number;
    counted_items: number;
    progress: number;
}

interface Props {
    stats: Stats;
    current_period: Period | null;
    recent_activities: Activity[];
    projects_summary: Project[];
    [key: string]: unknown;
}

export default function Dashboard({ stats, current_period, recent_activities, projects_summary }: Props) {
    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Heading title="📊 Stock Taking Dashboard" />
                    <div className="mt-4 sm:mt-0 space-x-3">
                        <Link href="/stock-opname/create">
                            <Button>📱 Start Stock Taking</Button>
                        </Link>
                        <Link href="/inventory">
                            <Button variant="outline">📦 View Inventory</Button>
                        </Link>
                    </div>
                </div>

                {/* Current Period Info */}
                {current_period && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900">
                                    📅 Current Period: {current_period.name}
                                </h3>
                                <p className="text-blue-700">
                                    {current_period.start_date} - {current_period.end_date}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-900">
                                    {stats.weekly_progress}%
                                </div>
                                <div className="text-sm text-blue-700">Complete</div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.weekly_progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">📦</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_items}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">✅</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Counted This Week</p>
                                <p className="text-2xl font-bold text-green-600">{stats.counted_items}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">📅</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Monthly Records</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.monthly_records}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">🎯</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Yearly Total</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.yearly_records}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Progress */}
                {projects_summary.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">🏗️ Projects Progress</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {projects_summary.map((project, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-medium text-gray-900">{project.name}</h4>
                                                <span className="text-sm text-gray-600">
                                                    {project.counted_items}/{project.total_items} items
                                                </span>
                                            </div>
                                            <div className="bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <span className="text-lg font-semibold text-gray-900">
                                                {project.progress}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">🕒 Recent Activities</h3>
                        <Link href="/stock-opname">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </div>
                    <div className="p-6">
                        {recent_activities.length > 0 ? (
                            <div className="space-y-4">
                                {recent_activities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                                        <div className="text-2xl">
                                            {activity.method === 'qr_scan' ? '📱' : '✏️'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.item_name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {activity.part_number} • {activity.storage}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    Std: {activity.qty_std} | Remaining: {activity.qty_sisa}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    by {activity.user_name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {activity.counted_at}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">📋</div>
                                <p className="text-gray-500">No recent activities</p>
                                <Link href="/stock-opname/create" className="mt-4 inline-block">
                                    <Button>Start Your First Count</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/stock-opname/create?method=qr">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all">
                            <div className="text-3xl mb-2">📱</div>
                            <h3 className="text-lg font-semibold">QR Code Scan</h3>
                            <p className="text-blue-100">Scan storage QR codes to update items quickly</p>
                        </div>
                    </Link>

                    <Link href="/stock-opname/create?method=manual">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all">
                            <div className="text-3xl mb-2">✏️</div>
                            <h3 className="text-lg font-semibold">Manual Entry</h3>
                            <p className="text-green-100">Browse projects and select items manually</p>
                        </div>
                    </Link>

                    <Link href="/reports">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all">
                            <div className="text-3xl mb-2">📊</div>
                            <h3 className="text-lg font-semibold">View Reports</h3>
                            <p className="text-purple-100">Generate detailed inventory reports</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}