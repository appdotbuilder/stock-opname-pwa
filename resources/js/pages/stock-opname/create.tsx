import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link, router, useForm } from '@inertiajs/react';

interface ActivePeriod {
    id: number;
    name: string;
    type: string;
}

interface InventoryItem {
    id: number;
    part: string;
    part_name: string;
    part_number: string;
    storage: string;
    qty_std: number;
    qty_sisa: number;
    current_remark?: string;
}

interface Props {
    active_period: ActivePeriod | null;
    projects: string[];
    parts: InventoryItem[];
    selected_project?: string;
    selected_storage?: string;
    selected_item: InventoryItem | null;
    is_qr_scan: boolean;
    [key: string]: unknown;
}

export default function StockOpnameCreate({ 
    active_period, 
    projects, 
    parts, 
    selected_project, 
    selected_storage, 
    selected_item, 
    is_qr_scan 
}: Props) {
    const [selectedProject, setSelectedProject] = useState(selected_project || '');
    const [selectedItemId, setSelectedItemId] = useState<number | null>(selected_item?.id || null);
    const [storageCode, setStorageCode] = useState(selected_storage || '');
    const [mode, setMode] = useState<'manual' | 'qr'>(is_qr_scan ? 'qr' : 'manual');

    const { data, setData, post, processing, errors } = useForm({
        inventory_item_id: selected_item?.id || 0,
        stock_taking_period_id: active_period?.id || 0,
        qty_std: selected_item?.qty_std || 0,
        qty_sisa: selected_item?.qty_sisa || 0,
        remark: selected_item?.current_remark || '',
        method: is_qr_scan ? 'qr_scan' : 'manual',
    });

    const currentItem = selectedItemId ? parts.find(p => p.id === selectedItemId) : selected_item;

    useEffect(() => {
        if (currentItem) {
            setData(prev => ({
                ...prev,
                inventory_item_id: currentItem.id,
                qty_std: currentItem.qty_std,
                qty_sisa: currentItem.qty_sisa,
                remark: currentItem.current_remark || '',
            }));
        }
    }, [currentItem, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!active_period) {
            alert('No active stock taking period found');
            return;
        }
        post('/stock-opname');
    };

    const handleProjectChange = (project: string) => {
        setSelectedProject(project);
        setSelectedItemId(null);
        router.get('/stock-opname/create', { project }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleQRScan = () => {
        if (storageCode.trim()) {
            router.get('/stock-opname/create', { storage: storageCode.trim() }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    if (!active_period) {
        return (
            <AppShell>
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Period</h2>
                    <p className="text-gray-600 mb-6">
                        There is no active stock taking period. Please contact your administrator.
                    </p>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="📱 New Stock Count" />
                    <Link href="/stock-opname">
                        <Button variant="outline">← Back to Records</Button>
                    </Link>
                </div>

                {/* Period Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900">
                        📅 Current Period: {active_period.name}
                    </h3>
                    <p className="text-sm text-blue-700">Type: {active_period.type}</p>
                </div>

                {/* Mode Selection */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">🔍 Selection Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setMode('qr')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                mode === 'qr'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="text-3xl mb-2">📱</div>
                            <h4 className="font-semibold">QR Code Scan</h4>
                            <p className="text-sm text-gray-600">Scan storage location QR code</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('manual')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                mode === 'manual'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="text-3xl mb-2">✏️</div>
                            <h4 className="font-semibold">Manual Selection</h4>
                            <p className="text-sm text-gray-600">Browse projects and select items</p>
                        </button>
                    </div>
                </div>

                {/* QR Scan Mode */}
                {mode === 'qr' && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">📱 QR Code Scanner</h3>
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={storageCode}
                                onChange={(e) => setStorageCode(e.target.value)}
                                placeholder="Enter or scan storage code (e.g., A-01-01)"
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                            />
                            <Button onClick={handleQRScan} disabled={!storageCode.trim()}>
                                📷 Scan
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            💡 Tip: Use your device's camera to scan QR codes or enter the storage code manually
                        </p>
                    </div>
                )}

                {/* Manual Mode */}
                {mode === 'manual' && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">✏️ Manual Selection</h3>
                        
                        {/* Project Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Project
                            </label>
                            <select
                                value={selectedProject}
                                onChange={(e) => handleProjectChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Choose a project...</option>
                                {projects.map((project) => (
                                    <option key={project} value={project}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Parts Selection */}
                        {selectedProject && parts.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Item ({parts.length} available)
                                </label>
                                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
                                    {parts.map((part) => (
                                        <div
                                            key={part.id}
                                            onClick={() => setSelectedItemId(part.id)}
                                            className={`p-3 cursor-pointer border-b border-gray-200 last:border-b-0 hover:bg-gray-50 ${
                                                selectedItemId === part.id ? 'bg-blue-50 border-blue-200' : ''
                                            }`}
                                        >
                                            <div className="font-medium">{part.part_name}</div>
                                            <div className="text-sm text-gray-600">
                                                {part.part_number} • Storage: {part.storage}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Current: Std {part.qty_std} | Remaining {part.qty_sisa}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Selected Item & Count Form */}
                {currentItem && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">📦 Selected Item</h3>
                        
                        {/* Item Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{currentItem.part_name}</h4>
                                    <p className="text-sm text-gray-600">
                                        {currentItem.part_number} • {currentItem.part}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Storage: {currentItem.storage}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Current Std Qty:</span>
                                            <span className="font-medium">{currentItem.qty_std}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Current Remaining:</span>
                                            <span className="font-medium">{currentItem.qty_sisa}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Count Form */}
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
                                    {processing ? 'Saving...' : '💾 Save Stock Count'}
                                </Button>
                                <Link href="/stock-opname">
                                    <Button variant="outline" type="button">Cancel</Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                {/* Help Section */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">💡 Tips</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Use QR scan for faster processing of items in specific storage locations</li>
                        <li>• Manual selection allows you to browse all items in a project</li>
                        <li>• Standard quantity represents the main inventory count</li>
                        <li>• Remaining quantity tracks partial or reserve stock</li>
                        <li>• Add remarks for any discrepancies or special notes</li>
                    </ul>
                </div>
            </div>
        </AppShell>
    );
}