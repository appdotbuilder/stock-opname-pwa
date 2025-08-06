<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStockOpnameRequest;
use App\Http\Requests\UpdateStockOpnameRequest;
use App\Models\InventoryItem;
use App\Models\StockOpnameRecord;
use App\Models\StockTakingPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockOpnameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StockOpnameRecord::with(['inventoryItem', 'user', 'stockTakingPeriod']);

        // Filter by period
        if ($request->period_id) {
            $query->where('stock_taking_period_id', $request->period_id);
        }

        // Filter by project
        if ($request->project) {
            $query->whereHas('inventoryItem', function ($q) use ($request) {
                $q->where('project', $request->project);
            });
        }

        // Filter by method
        if ($request->method) {
            $query->where('method', $request->method);
        }

        $records = $query->latest('counted_at')->paginate(20);

        $periods = StockTakingPeriod::orderBy('start_date', 'desc')->get(['id', 'name', 'type', 'status']);
        $projects = InventoryItem::distinct('project')->pluck('project');

        return Inertia::render('stock-opname/index', [
            'records' => $records,
            'periods' => $periods,
            'projects' => $projects,
            'filters' => $request->only(['period_id', 'project', 'method']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $activePeriod = StockTakingPeriod::active()->first();
        
        if (!$activePeriod) {
            return redirect()->back()->with('error', 'No active stock taking period found.');
        }

        $projects = InventoryItem::distinct('project')->pluck('project');
        $parts = collect();
        $selectedItem = null;

        // QR Code scan - get item by storage
        if ($request->storage) {
            $selectedItem = InventoryItem::where('storage', $request->storage)->first();
            if ($selectedItem) {
                $parts = collect([$selectedItem]);
            }
        }
        // Manual selection - get parts by project
        elseif ($request->project) {
            $parts = InventoryItem::where('project', $request->project)
                ->get(['id', 'part', 'part_name', 'part_number', 'storage', 'qty_std', 'qty_sisa']);
        }

        return Inertia::render('stock-opname/create', [
            'active_period' => [
                'id' => $activePeriod->id,
                'name' => $activePeriod->name,
                'type' => $activePeriod->type,
            ],
            'projects' => $projects,
            'parts' => $parts,
            'selected_project' => $request->project,
            'selected_storage' => $request->storage,
            'selected_item' => $selectedItem ? [
                'id' => $selectedItem->id,
                'part' => $selectedItem->part,
                'part_name' => $selectedItem->part_name,
                'part_number' => $selectedItem->part_number,
                'storage' => $selectedItem->storage,
                'qty_std' => $selectedItem->qty_std,
                'qty_sisa' => $selectedItem->qty_sisa,
                'current_remark' => $selectedItem->remark,
            ] : null,
            'is_qr_scan' => (bool) $request->storage,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockOpnameRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['counted_at'] = now();

        // Check if record already exists for this period and item
        $existingRecord = StockOpnameRecord::where('stock_taking_period_id', $validated['stock_taking_period_id'])
            ->where('inventory_item_id', $validated['inventory_item_id'])
            ->first();

        if ($existingRecord) {
            // Update existing record
            $existingRecord->update([
                'qty_std' => $validated['qty_std'],
                'qty_sisa' => $validated['qty_sisa'],
                'remark' => $validated['remark'],
                'method' => $validated['method'],
                'user_id' => $validated['user_id'],
                'counted_at' => $validated['counted_at'],
            ]);
            $record = $existingRecord;
        } else {
            // Create new record
            $record = StockOpnameRecord::create($validated);
        }

        // Update inventory item quantities
        $inventoryItem = InventoryItem::find($validated['inventory_item_id']);
        $inventoryItem->update([
            'qty_std' => $validated['qty_std'],
            'qty_sisa' => $validated['qty_sisa'],
            'remark' => $validated['remark'],
        ]);

        return redirect()->route('stock-opname.show', $record)
            ->with('success', 'Stock opname record saved successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StockOpnameRecord $stockOpname)
    {
        $stockOpname->load(['inventoryItem', 'user', 'stockTakingPeriod']);

        return Inertia::render('stock-opname/show', [
            'record' => [
                'id' => $stockOpname->id,
                'qty_std' => $stockOpname->qty_std,
                'qty_sisa' => $stockOpname->qty_sisa,
                'remark' => $stockOpname->remark,
                'method' => $stockOpname->method,
                'counted_at' => $stockOpname->counted_at->format('M j, Y H:i'),
                'created_at' => $stockOpname->created_at->format('M j, Y H:i'),
                'updated_at' => $stockOpname->updated_at->format('M j, Y H:i'),
                'inventory_item' => [
                    'id' => $stockOpname->inventoryItem->id,
                    'part' => $stockOpname->inventoryItem->part,
                    'part_name' => $stockOpname->inventoryItem->part_name,
                    'part_number' => $stockOpname->inventoryItem->part_number,
                    'storage' => $stockOpname->inventoryItem->storage,
                    'project' => $stockOpname->inventoryItem->project,
                    'type' => $stockOpname->inventoryItem->type,
                    'supplier_name' => $stockOpname->inventoryItem->supplier_name,
                    'initial_qty_std' => $stockOpname->inventoryItem->initial_qty_std,
                    'initial_qty_sisa' => $stockOpname->inventoryItem->initial_qty_sisa,
                ],
                'user' => [
                    'name' => $stockOpname->user->name,
                    'email' => $stockOpname->user->email,
                ],
                'period' => [
                    'name' => $stockOpname->stockTakingPeriod->name,
                    'type' => $stockOpname->stockTakingPeriod->type,
                    'status' => $stockOpname->stockTakingPeriod->status,
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockOpnameRecord $stockOpname)
    {
        $stockOpname->load(['inventoryItem', 'stockTakingPeriod']);

        return Inertia::render('stock-opname/edit', [
            'record' => [
                'id' => $stockOpname->id,
                'qty_std' => $stockOpname->qty_std,
                'qty_sisa' => $stockOpname->qty_sisa,
                'remark' => $stockOpname->remark,
                'inventory_item' => [
                    'part' => $stockOpname->inventoryItem->part,
                    'part_name' => $stockOpname->inventoryItem->part_name,
                    'part_number' => $stockOpname->inventoryItem->part_number,
                    'storage' => $stockOpname->inventoryItem->storage,
                    'project' => $stockOpname->inventoryItem->project,
                ],
                'period' => [
                    'name' => $stockOpname->stockTakingPeriod->name,
                    'type' => $stockOpname->stockTakingPeriod->type,
                ],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockOpnameRequest $request, StockOpnameRecord $stockOpname)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['counted_at'] = now();

        $stockOpname->update($validated);

        // Update inventory item quantities
        $stockOpname->inventoryItem->update([
            'qty_std' => $validated['qty_std'],
            'qty_sisa' => $validated['qty_sisa'],
            'remark' => $validated['remark'],
        ]);

        return redirect()->route('stock-opname.show', $stockOpname)
            ->with('success', 'Stock opname record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockOpnameRecord $stockOpname)
    {
        if (!auth()->user()->isAdmin()) {
            return redirect()->back()->with('error', 'Only administrators can delete stock opname records.');
        }

        $stockOpname->delete();

        return redirect()->route('stock-opname.index')
            ->with('success', 'Stock opname record deleted successfully.');
    }
}