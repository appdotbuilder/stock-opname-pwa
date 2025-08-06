import React from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';

interface StockOpnameRecordData {
    id: number;
    qty_std: number;
    qty_sisa: number;
    remark: string | null;
    inventory_item: {
        part: string;
        part_name: string;
        part_number: string;
        storage: string;
        project: string;
    };
    period: {
        name: string;
        type: string;
    };
}

interface Props {
    record: StockOpnameRecordData;
    [key: string]: unknown;
}

export default function StockOpnameEdit({ record }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        qty_std: record.qty_std,
        qty_sisa: record.qty_sisa,
        remark: record.remark || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/stock-opname/${record.id}`);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="✏️ Edit Stock Count" />
                    <Link href={`/stock-opname/${record.id}`}>
                        <Button variant="outline">← Back to Details</Button>
                    </Link>
                </div>

                {/* Item Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">{record.inventory_item.part_name}</h3>
                            <p className="text-sm text-gray-600">
                                {record.inventory_item.part_number} • {record.inventory_item.part}
                            </p>
                        </div>
                        <div className="text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Storage:</span>
                                <span className="font-medium">{record.inventory_item.storage}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Project:</span>
                                <span>{record.inventory_item.project}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Period:</span>
                                <span>{record.period.name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">📊 Update Quantities</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📊 Standard Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={data.qty_std}
                                    onChange={(e) => setData('qty_std', parseInt(e.target.value) || 0)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    min="0"
                                    required
                                />
                                {errors.qty_std && (
                                    <p className="text-sm text-red-600 mt-1">{errors.qty_std}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📦 Remaining Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={data.qty_sisa}
                                    onChange={(e) => setData('qty_sisa', parseInt(e.target.value) || 0)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    min="0"
                                    required
                                />
                                {errors.qty_sisa && (
                                    <p className="text-sm text-red-600 mt-1">{errors.qty_sisa}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📝 Remarks
                            </label>
                            <textarea
                                value={data.remark}
                                onChange={(e) => setData('remark', e.target.value)}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Optional notes about this count..."
                            />
                            {errors.remark && (
                                <p className="text-sm text-red-600 mt-1">{errors.remark}</p>
                            )}
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <Button type="submit" disabled={processing} className="flex-1">
                                {processing ? 'Updating...' : '💾 Update Count'}
                            </Button>
                            <Link href={`/stock-opname/${record.id}`}>
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Edit Guidelines</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Changes will update both the stock record and inventory quantities</li>
                        <li>• The updated timestamp will reflect when you made these changes</li>
                        <li>• Only update quantities if you have verified them again</li>
                        <li>• Use remarks to document any corrections or updates</li>
                    </ul>
                </div>
            </div>
        </AppShell>
    );
}