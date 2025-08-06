import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';

interface InventoryItem {
    id: number;
    no: number;
    part: string;
    std_pack: number;
    project: string;
    part_name: string;
    part_number: string;
    storage: string;
    supplier_name: string | null;
    type: string;
    qty_std: number;
    qty_sisa: number;
    remark: string | null;
    created_at: string;
    updated_at: string;
}

interface Filters {
    search?: string;
    project?: string;
    storage?: string;
    type?: string;
}

interface Props {
    items: {
        data: InventoryItem[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        total: number;
    };
    projects: string[];
    storages: string[];
    types: string[];
    filters: Filters;
    [key: string]: unknown;
}

export default function InventoryIndex({ items, projects, storages, types, filters }: Props) {
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
        router.get('/inventory', localFilters as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/inventory');
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Heading title="📦 Inventory Items" />
                    <Link href="/dashboard">
                        <Button variant="outline">← Back to Dashboard</Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">🔍 Search & Filters</h3>
                    
                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            value={localFilters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search by item name, part number, storage..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
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
                            <select
                                value={localFilters.storage || ''}
                                onChange={(e) => handleFilterChange('storage', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Storages</option>
                                {storages.map((storage) => (
                                    <option key={storage} value={storage}>
                                        {storage}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={localFilters.type || ''}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Types</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button onClick={applyFilters}>Apply</Button>
                        <Button variant="outline" onClick={clearFilters}>Clear</Button>
                    </div>
                </div>

                {/* Items List */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📊 Items ({items.total} total)
                        </h3>
                    </div>

                    {items.data.length > 0 ? (
                        <>
                            {/* Mobile View */}
                            <div className="md:hidden">
                                {items.data.map((item) => (
                                    <div key={item.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.part_name}</h4>
                                                <p className="text-sm text-gray-600">{item.part_number}</p>
                                            </div>
                                            <Link href={`/inventory/${item.id}`}>
                                                <Button size="sm" variant="outline">View</Button>
                                            </Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                            <div>
                                                <span className="text-gray-500">Storage:</span>
                                                <span className="ml-1 font-medium">{item.storage}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Project:</span>
                                                <span className="ml-1">{item.project}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Std Qty:</span>
                                                <span className="ml-1 font-medium">{item.qty_std}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Remaining:</span>
                                                <span className="ml-1 font-medium">{item.qty_sisa}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="text-xs text-gray-500">
                                            Type: {item.type} • Supplier: {item.supplier_name || 'N/A'}
                                        </div>
                                        
                                        <div className="mt-2 flex space-x-2">
                                            <Link href={`/stock-opname/create?storage=${item.storage}`}>
                                                <Button size="sm">📱 Quick Count</Button>
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
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantities
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Supplier
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {items.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.part_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.part_number} • {item.part}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.project}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {item.storage}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div>Std: <span className="font-medium">{item.qty_std}</span></div>
                                                    <div>Remaining: <span className="font-medium">{item.qty_sisa}</span></div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.supplier_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link href={`/inventory/${item.id}`}>
                                                        <Button size="sm" variant="outline">View</Button>
                                                    </Link>
                                                    <Link href={`/stock-opname/create?storage=${item.storage}`}>
                                                        <Button size="sm">Count</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {items.last_page > 1 && (
                                <div className="px-6 py-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Page {items.current_page} of {items.last_page}
                                        </div>
                                        <div className="flex space-x-2">
                                            {items.links.map((link, index) => (
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
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No inventory items found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {Object.keys(filters).length > 0
                                    ? 'Try adjusting your search criteria.'
                                    : 'No items have been uploaded yet.'}
                            </p>
                            <div className="space-y-2">
                                <Link href="/dashboard">
                                    <Button>← Back to Dashboard</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                {items.data.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{items.total}</div>
                            <div className="text-sm text-blue-700">Total Items</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{projects.length}</div>
                            <div className="text-sm text-green-700">Projects</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{storages.length}</div>
                            <div className="text-sm text-purple-700">Storage Locations</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">{types.length}</div>
                            <div className="text-sm text-orange-700">Item Types</div>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}