import React from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface InventoryItem {
    id: number;
    no: number;
    part: string;
    std_pack: number;
    project: string;
    part_name: string;
    part_number: string;
    storage: string;
    supplier_code: string | null;
    supplier_name: string | null;
    type: string;
    image: string | null;
    initial_qty_std: number;
    initial_qty_sisa: number;
    initial_remark: string | null;
    qty_std: number;
    qty_sisa: number;
    remark: string | null;
    created_at: string;
    updated_at: string;
}

interface StockRecord {
    id: number;
    qty_std: number;
    qty_sisa: number;
    remark: string | null;
    method: string;
    counted_at: string;
    user_name: string;
    period_name: string;
}

interface Props {
    item: InventoryItem;
    recent_records: StockRecord[];
    [key: string]: unknown;
}

export default function InventoryShow({ item, recent_records }: Props) {
    const stdDifference = item.qty_std - item.initial_qty_std;
    const sisaDifference = item.qty_sisa - item.initial_qty_sisa;
    const totalCurrent = item.qty_std + item.qty_sisa;
    const totalInitial = item.initial_qty_std + item.initial_qty_sisa;
    const totalDifference = totalCurrent - totalInitial;

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title={`📦 ${item.part_name}`} />
                    <div className="space-x-3">
                        <Link href={`/stock-opname/create?storage=${item.storage}`}>
                            <Button>📱 Count This Item</Button>
                        </Link>
                        <Link href="/inventory">
                            <Button variant="outline">← Back to Inventory</Button>
                        </Link>
                    </div>
                </div>

                {/* Item Overview */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">ℹ️ Basic Information</h3>
                            <dl className="space-y-2">
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Item Number:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.no}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Part Code:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.part}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Part Number:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.part_number}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Standard Pack:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.std_pack}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Project:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.project}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Type:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.type}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Storage:</dt>
                                    <dd className="text-sm font-bold text-blue-600">{item.storage}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Supplier Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">🏢 Supplier Information</h3>
                            <dl className="space-y-2">
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Supplier Code:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.supplier_code || 'N/A'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Supplier Name:</dt>
                                    <dd className="text-sm font-medium text-gray-900">{item.supplier_name || 'N/A'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Created:</dt>
                                    <dd className="text-sm text-gray-900">{item.created_at}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">Last Updated:</dt>
                                    <dd className="text-sm text-gray-900">{item.updated_at}</dd>
                                </div>
                            </dl>

                            {item.image && (
                                <div className="mt-4">
                                    <dt className="text-sm font-medium text-gray-600 mb-2">Item Image:</dt>
                                    <img 
                                        src={item.image} 
                                        alt={item.part_name}
                                        className="w-32 h-32 object-cover rounded border"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Current Quantities */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">📊 Current Quantities</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">{item.qty_std}</div>
                            <div className="text-sm text-blue-700 font-medium">Standard Quantity</div>
                            {stdDifference !== 0 && (
                                <div className={`text-xs mt-1 ${stdDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stdDifference > 0 ? '+' : ''}{stdDifference} from initial
                                </div>
                            )}
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">{item.qty_sisa}</div>
                            <div className="text-sm text-green-700 font-medium">Remaining Quantity</div>
                            {sisaDifference !== 0 && (
                                <div className={`text-xs mt-1 ${sisaDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {sisaDifference > 0 ? '+' : ''}{sisaDifference} from initial
                                </div>
                            )}
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-600">{totalCurrent}</div>
                            <div className="text-sm text-purple-700 font-medium">Total Current</div>
                            {totalDifference !== 0 && (
                                <div className={`text-xs mt-1 ${totalDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {totalDifference > 0 ? '+' : ''}{totalDifference} from initial
                                </div>
                            )}
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-3xl font-bold text-gray-600">{totalInitial}</div>
                            <div className="text-sm text-gray-700 font-medium">Initial Total</div>
                            <div className="text-xs text-gray-500 mt-1">
                                Starting quantity
                            </div>
                        </div>
                    </div>

                    {item.remark && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <h4 className="text-sm font-medium text-yellow-800 mb-1">📝 Current Remarks</h4>
                            <p className="text-sm text-yellow-700">{item.remark}</p>
                        </div>
                    )}
                </div>

                {/* Quantity Comparison Table */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">📈 Quantity History</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Type
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                        Initial
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                        Current
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                        Change
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                        % Change
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Standard Qty</td>
                                    <td className="px-4 py-3 text-sm text-center">{item.initial_qty_std}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold">{item.qty_std}</td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        <span className={`font-semibold ${
                                            stdDifference > 0 ? 'text-green-600' : stdDifference < 0 ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            {stdDifference > 0 ? '+' : ''}{stdDifference}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        {item.initial_qty_std > 0 ? 
                                            `${((stdDifference / item.initial_qty_std) * 100).toFixed(1)}%` : 
                                            'N/A'
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Remaining Qty</td>
                                    <td className="px-4 py-3 text-sm text-center">{item.initial_qty_sisa}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold">{item.qty_sisa}</td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        <span className={`font-semibold ${
                                            sisaDifference > 0 ? 'text-green-600' : sisaDifference < 0 ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            {sisaDifference > 0 ? '+' : ''}{sisaDifference}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        {item.initial_qty_sisa > 0 ? 
                                            `${((sisaDifference / item.initial_qty_sisa) * 100).toFixed(1)}%` : 
                                            'N/A'
                                        }
                                    </td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold">{totalInitial}</td>
                                    <td className="px-4 py-3 text-sm text-center font-bold">{totalCurrent}</td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        <span className={`font-bold ${
                                            totalDifference > 0 ? 'text-green-600' : totalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            {totalDifference > 0 ? '+' : ''}{totalDifference}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold">
                                        {totalInitial > 0 ? 
                                            `${((totalDifference / totalInitial) * 100).toFixed(1)}%` : 
                                            'N/A'
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Stock Records */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">🕒 Recent Stock Records</h3>
                    
                    {recent_records.length > 0 ? (
                        <div className="space-y-3">
                            {recent_records.map((record) => (
                                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">
                                            {record.method === 'qr_scan' ? '📱' : '✏️'}
                                        </span>
                                        <div>
                                            <div className="font-medium text-sm">
                                                Std: {record.qty_std} | Remaining: {record.qty_sisa}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {record.period_name} • by {record.user_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {record.counted_at}
                                    </div>
                                </div>
                            ))}
                            
                            <Link href="/stock-opname" className="inline-block">
                                <Button variant="outline" size="sm">View All Records</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="text-2xl mb-2">📋</div>
                            <p className="text-gray-500 mb-3">No stock counting records yet</p>
                            <Link href={`/stock-opname/create?storage=${item.storage}`}>
                                <Button>📱 Count This Item</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Initial Remarks */}
                {item.initial_remark && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-3">📝 Initial Remarks</h3>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-800">{item.initial_remark}</p>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Link href={`/stock-opname/create?storage=${item.storage}`} className="flex-1">
                            <Button className="w-full">📱 Count This Item</Button>
                        </Link>
                        <Link href={`/inventory?storage=${item.storage}`} className="flex-1">
                            <Button variant="outline" className="w-full">🏢 View Same Storage</Button>
                        </Link>
                        <Link href={`/inventory?project=${encodeURIComponent(item.project)}`} className="flex-1">
                            <Button variant="outline" className="w-full">🏗️ View Same Project</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}