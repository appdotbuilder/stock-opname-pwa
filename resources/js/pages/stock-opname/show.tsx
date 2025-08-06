import React from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface StockOpnameRecordDetail {
    id: number;
    qty_std: number;
    qty_sisa: number;
    remark: string | null;
    method: string;
    counted_at: string;
    created_at: string;
    updated_at: string;
    inventory_item: {
        id: number;
        part: string;
        part_name: string;
        part_number: string;
        storage: string;
        project: string;
        type: string;
        supplier_name: string | null;
        initial_qty_std: number;
        initial_qty_sisa: number;
    };
    user: {
        name: string;
        email: string;
    };
    period: {
        name: string;
        type: string;
        status: string;
    };
}

interface Props {
    record: StockOpnameRecordDetail;
    [key: string]: unknown;
}

export default function StockOpnameShow({ record }: Props) {
    const stdDifference = record.qty_std - record.inventory_item.initial_qty_std;
    const sisaDifference = record.qty_sisa - record.inventory_item.initial_qty_sisa;

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="📋 Stock Count Details" />
                    <div className="space-x-3">
                        <Link href={`/stock-opname/${record.id}/edit`}>
                            <Button variant="outline">✏️ Edit</Button>
                        </Link>
                        <Link href="/stock-opname">
                            <Button variant="outline">← Back to Records</Button>
                        </Link>
                    </div>
                </div>

                {/* Record Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📊 Count Summary
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">
                                {record.method === 'qr_scan' ? '📱' : '✏️'}
                            </span>
                            <span className="text-sm text-gray-600">
                                {record.method === 'qr_scan' ? 'QR Scan' : 'Manual Entry'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">{record.qty_std}</div>
                            <div className="text-sm text-blue-700 font-medium">Standard Quantity</div>
                            {stdDifference !== 0 && (
                                <div className={`text-xs mt-1 ${stdDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stdDifference > 0 ? '+' : ''}{stdDifference} from initial
                                </div>
                            )}
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">{record.qty_sisa}</div>
                            <div className="text-sm text-green-700 font-medium">Remaining Quantity</div>
                            {sisaDifference !== 0 && (
                                <div className={`text-xs mt-1 ${sisaDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {sisaDifference > 0 ? '+' : ''}{sisaDifference} from initial
                                </div>
                            )}
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-3xl font-bold text-gray-600">
                                {record.qty_std + record.qty_sisa}
                            </div>
                            <div className="text-sm text-gray-700 font-medium">Total Counted</div>
                        </div>
                    </div>

                    {record.remark && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <h4 className="text-sm font-medium text-yellow-800 mb-1">📝 Remarks</h4>
                            <p className="text-sm text-yellow-700">{record.remark}</p>
                        </div>
                    )}
                </div>

                {/* Item Details */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Item Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Item Name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.inventory_item.part_name}</dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Part Number</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.inventory_item.part_number}</dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Part Code</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.inventory_item.part}</dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Storage Location</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-medium">{record.inventory_item.storage}</dd>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Project</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.inventory_item.project}</dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Type</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.inventory_item.type}</dd>
                            </div>
                            
                            {record.inventory_item.supplier_name && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{record.inventory_item.supplier_name}</dd>
                                </div>
                            )}
                            
                            <div>
                                <Link href={`/inventory/${record.inventory_item.id}`}>
                                    <Button variant="outline" size="sm">View Full Item Details</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Initial vs Current Comparison */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Quantity Comparison</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Quantity Type
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                        Initial
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                        Counted
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                        Difference
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Standard Quantity</td>
                                    <td className="px-4 py-3 text-sm text-center">{record.inventory_item.initial_qty_std}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold">{record.qty_std}</td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        <span className={`font-semibold ${
                                            stdDifference > 0 ? 'text-green-600' : stdDifference < 0 ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            {stdDifference > 0 ? '+' : ''}{stdDifference}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Remaining Quantity</td>
                                    <td className="px-4 py-3 text-sm text-center">{record.inventory_item.initial_qty_sisa}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold">{record.qty_sisa}</td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        <span className={`font-semibold ${
                                            sisaDifference > 0 ? 'text-green-600' : sisaDifference < 0 ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            {sisaDifference > 0 ? '+' : ''}{sisaDifference}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Period and User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Period Information</h3>
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Period Name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.period.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 capitalize">{record.period.type}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        record.period.status === 'active' 
                                            ? 'bg-green-100 text-green-800'
                                            : record.period.status === 'completed'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {record.period.status}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Count Information</h3>
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Counted By</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.user.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.user.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Counted At</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.counted_at}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                <dd className="mt-1 text-sm text-gray-900">{record.updated_at}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Link href={`/stock-opname/${record.id}/edit`} className="flex-1">
                            <Button variant="outline" className="w-full">✏️ Edit This Record</Button>
                        </Link>
                        <Link href={`/inventory/${record.inventory_item.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">📦 View Item Details</Button>
                        </Link>
                        <Link href="/stock-opname/create" className="flex-1">
                            <Button className="w-full">📱 Count Another Item</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}