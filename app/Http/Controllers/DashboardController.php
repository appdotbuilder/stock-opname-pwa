<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\StockOpnameRecord;
use App\Models\StockTakingPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $currentPeriod = StockTakingPeriod::where('status', 'active')
            ->where('type', 'weekly')
            ->first();

        $totalItems = InventoryItem::count();
        $countedItems = 0;
        $weeklyProgress = 0;

        if ($currentPeriod) {
            $countedItems = StockOpnameRecord::where('stock_taking_period_id', $currentPeriod->id)
                ->distinct('inventory_item_id')
                ->count();
            $weeklyProgress = $totalItems > 0 ? round(($countedItems / $totalItems) * 100, 1) : 0;
        }

        // Monthly achievement
        $currentMonth = now()->startOfMonth();
        $monthlyRecords = StockOpnameRecord::whereHas('stockTakingPeriod', function ($query) use ($currentMonth) {
            $query->where('start_date', '>=', $currentMonth);
        })->count();

        // Yearly achievement
        $currentYear = now()->startOfYear();
        $yearlyRecords = StockOpnameRecord::whereHas('stockTakingPeriod', function ($query) use ($currentYear) {
            $query->where('start_date', '>=', $currentYear);
        })->count();

        // Recent activities
        $recentActivities = StockOpnameRecord::with(['inventoryItem', 'user', 'stockTakingPeriod'])
            ->latest('counted_at')
            ->take(10)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'item_name' => $record->inventoryItem->part_name,
                    'part_number' => $record->inventoryItem->part_number,
                    'storage' => $record->inventoryItem->storage,
                    'user_name' => $record->user->name,
                    'method' => $record->method,
                    'counted_at' => $record->counted_at->format('M j, Y H:i'),
                    'qty_std' => $record->qty_std,
                    'qty_sisa' => $record->qty_sisa,
                ];
            });

        // Projects summary
        $projectsSummary = collect(DB::select("
            SELECT 
                project,
                COUNT(*) as total_items,
                COUNT(CASE WHEN EXISTS(
                    SELECT 1 FROM stock_opname_records sor 
                    JOIN stock_taking_periods stp ON sor.stock_taking_period_id = stp.id 
                    WHERE sor.inventory_item_id = inventory_items.id 
                    AND stp.status = 'active' 
                    AND stp.type = 'weekly'
                ) THEN 1 END) as counted_items
            FROM inventory_items 
            GROUP BY project
        "))->map(function ($project) {
            $progress = $project->total_items > 0 ? 
                round(($project->counted_items / $project->total_items) * 100, 1) : 0;
            return [
                'name' => $project->project,
                'total_items' => (int) $project->total_items,
                'counted_items' => (int) $project->counted_items,
                'progress' => $progress,
            ];
        });

        return Inertia::render('dashboard', [
            'stats' => [
                'total_items' => $totalItems,
                'counted_items' => $countedItems,
                'weekly_progress' => $weeklyProgress,
                'monthly_records' => $monthlyRecords,
                'yearly_records' => $yearlyRecords,
            ],
            'current_period' => $currentPeriod ? [
                'id' => $currentPeriod->id,
                'name' => $currentPeriod->name,
                'type' => $currentPeriod->type,
                'start_date' => $currentPeriod->start_date->format('M j, Y'),
                'end_date' => $currentPeriod->end_date->format('M j, Y'),
            ] : null,
            'recent_activities' => $recentActivities,
            'projects_summary' => $projectsSummary,
        ]);
    }
}