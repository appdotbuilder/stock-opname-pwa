<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = InventoryItem::query();

        // Search functionality
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('part_name', 'like', "%{$search}%")
                  ->orWhere('part_number', 'like', "%{$search}%")
                  ->orWhere('part', 'like', "%{$search}%")
                  ->orWhere('storage', 'like', "%{$search}%");
            });
        }

        // Filter by project
        if ($request->project) {
            $query->where('project', $request->project);
        }

        // Filter by storage
        if ($request->storage) {
            $query->where('storage', $request->storage);
        }

        // Filter by type
        if ($request->type) {
            $query->where('type', $request->type);
        }

        $items = $query->latest()->paginate(20);

        $projects = InventoryItem::distinct('project')->pluck('project');
        $storages = InventoryItem::distinct('storage')->pluck('storage');
        $types = InventoryItem::distinct('type')->pluck('type');

        return Inertia::render('inventory/index', [
            'items' => $items,
            'projects' => $projects,
            'storages' => $storages,
            'types' => $types,
            'filters' => $request->only(['search', 'project', 'storage', 'type']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryItem $inventory)
    {
        $inventory->load(['stockOpnameRecords' => function ($query) {
            $query->with(['user', 'stockTakingPeriod'])->latest('counted_at')->take(10);
        }]);

        return Inertia::render('inventory/show', [
            'item' => [
                'id' => $inventory->id,
                'no' => $inventory->no,
                'part' => $inventory->part,
                'std_pack' => $inventory->std_pack,
                'project' => $inventory->project,
                'part_name' => $inventory->part_name,
                'part_number' => $inventory->part_number,
                'storage' => $inventory->storage,
                'supplier_code' => $inventory->supplier_code,
                'supplier_name' => $inventory->supplier_name,
                'type' => $inventory->type,
                'image' => $inventory->image,
                'initial_qty_std' => $inventory->initial_qty_std,
                'initial_qty_sisa' => $inventory->initial_qty_sisa,
                'initial_remark' => $inventory->initial_remark,
                'qty_std' => $inventory->qty_std,
                'qty_sisa' => $inventory->qty_sisa,
                'remark' => $inventory->remark,
                'created_at' => $inventory->created_at->format('M j, Y H:i'),
                'updated_at' => $inventory->updated_at->format('M j, Y H:i'),
            ],
            'recent_records' => $inventory->stockOpnameRecords->map(function ($record) {
                return [
                    'id' => $record->id,
                    'qty_std' => $record->qty_std,
                    'qty_sisa' => $record->qty_sisa,
                    'remark' => $record->remark,
                    'method' => $record->method,
                    'counted_at' => $record->counted_at->format('M j, Y H:i'),
                    'user_name' => $record->user->name,
                    'period_name' => $record->stockTakingPeriod->name,
                ];
            }),
        ]);
    }
}