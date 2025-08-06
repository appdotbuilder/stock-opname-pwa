import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';

interface StockOpnameRecord {
    id: number;
    qty_std: number;
    qty_sisa: number;
    remark: string | null;
    method: string;
    counted_at: string;
    inventory_item: {
        part_name: string;
        part_number: string;
        storage: string;
        project: string;
    };
    user: {
        name: string;
    };
    stock_taking_period: {
        name: string;
        type: string;
    };
}

interface Filters {
    period_id?: string;
    project?: string;
    method?: string;
}

interface Props {
    records: {
        data: StockOpnameRecord[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        total: number;
    };
    periods: Array<{
        id: number;
        name: string;
        type: string;
        status: string;
    }>;
    projects: string[];
    filters: Filters;
    [key: string]: unknown;
}

export default function StockOpnameIndex({ records, periods, projects, filters }: Props) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        const newFilters = { ...localFilters };
        if (value) {
            (newFilters as Record<string, string>)[key] = value;
        } else {
            delete (newFilters as Record<string, unknown>)[key];
        }
        setLocalFilters(newFilters);
    };

    const applyFilters = () => {
        router.get('/stock-opname', localFilters as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/stock-opname');
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Heading title="📋 Stock Opname Records" />
                    <Link href="/stock-opname/create">
                        <Button>➕ New Stock Count</Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">🔍 Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Period
                            </label>
                            <select
                                value={localFilters.period_id || ''}
                                onChange={(e) => handleFilterChange('period_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Periods</option>
                                {periods.map((period) => (
                                    <option key={period.id} value={period.id.toString()}>
                                        {period.name} ({period.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project
                            </label>
                            <select
                                value={localFilters.project || ''}
                                onChange={(e) => handleFilterChange('project', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Projects</option>
                                {projects.map((project) => (
                                    <option key={project} value={project}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Method
                            </label>
                            <select
                                value={localFilters.method || ''}
                                onChange={(e) => handleFilterChange('method', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Methods</option>
                                <option value="manual">✏️ Manual</option>
                                <option value="qr_scan">📱 QR Scan</option>
                            </select>
                        </div>

                        <div className="flex items-end space-x-2">
                            <Button onClick={applyFilters} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Records Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📊 Records ({records.total} total)
                        </h3>
                    </div>

                    {records.data.length > 0 ? (
                        <>
                            {/* Mobile View */}
                            <div className="md:hidden">
                                {records.data.map((record) => (
                                    <div key={record.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {record.inventory_item.part_name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {record.inventory_item.part_number}
                                                </p>
                                            </div>
                                            <div className="text-xl">
                                                {record.method === 'qr_scan' ? '📱' : '✏️'}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                            <div>
                                                <span className="text-gray-500">Storage:</span>
                                                <span className="ml-1 font-medium">{record.inventory_item.storage}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Project:</span>
                                                <span className="ml-1">{record.inventory_item.project}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Std Qty:</span>
                                                <span className="ml-1 font-medium">{record.qty_std}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Remaining:</span>
                                                <span className="ml-1 font-medium">{record.qty_sisa}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>by {record.user.name}</span>
                                            <span>{record.counted_at}</span>
                                        </div>
                                        
                                        <div className="mt-2">
                                            <Link href={`/stock-opname/${record.id}`}>
                                                <Button size="sm" variant="outline">View Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Storage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantities
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Method
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Counted At
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {records.data.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {record.inventory_item.part_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {record.inventory_item.part_number}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.inventory_item.project}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.inventory_item.storage}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div>Std: {record.qty_std}</div>
                                                    <div>Remaining: {record.qty_sisa}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className="text-lg mr-1">
                                                        {record.method === 'qr_scan' ? '📱' : '✏️'}
                                                    </span>
                                                    {record.method === 'qr_scan' ? 'QR Scan' : 'Manual'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.counted_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link href={`/stock-opname/${record.id}`}>
                                                        <Button size="sm" variant="outline">View</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {records.last_page > 1 && (
                                <div className="px-6 py-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Page {records.current_page} of {records.last_page}
                                        </div>
                                        <div className="flex space-x-2">
                                            {records.links.map((link, index) => (
                                                link.url && (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-3 py-1 text-sm rounded ${
                                                            link.active
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No stock opname records found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {Object.keys(filters).length > 0
                                    ? 'Try adjusting your filters or create your first record.'
                                    : 'Get started by creating your first stock count.'}
                            </p>
                            <Link href="/stock-opname/create">
                                <Button>📱 Start Stock Taking</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}