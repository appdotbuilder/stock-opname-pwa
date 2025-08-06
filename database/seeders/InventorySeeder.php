<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\StockOpnameRecord;
use App\Models\StockTakingPeriod;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create users with different roles
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $stockTaker1 = User::create([
            'name' => 'Stock Taker 1',
            'email' => 'stock1@example.com',
            'password' => bcrypt('password'),
            'role' => 'stock_taker',
            'email_verified_at' => now(),
        ]);

        $stockTaker2 = User::create([
            'name' => 'Stock Taker 2',
            'email' => 'stock2@example.com',
            'password' => bcrypt('password'),
            'role' => 'stock_taker',
            'email_verified_at' => now(),
        ]);

        $viewer = User::create([
            'name' => 'Viewer User',
            'email' => 'viewer@example.com',
            'password' => bcrypt('password'),
            'role' => 'viewer',
            'email_verified_at' => now(),
        ]);

        // Create stock taking periods
        $currentPeriod = StockTakingPeriod::create([
            'name' => 'Week ' . now()->weekOfYear . ' ' . now()->year,
            'type' => 'weekly',
            'start_date' => now()->startOfWeek(),
            'end_date' => now()->endOfWeek(),
            'status' => 'active',
        ]);

        $lastWeekPeriod = StockTakingPeriod::create([
            'name' => 'Week ' . now()->subWeek()->weekOfYear . ' ' . now()->year,
            'type' => 'weekly',
            'start_date' => now()->subWeek()->startOfWeek(),
            'end_date' => now()->subWeek()->endOfWeek(),
            'status' => 'completed',
        ]);

        $monthlyPeriod = StockTakingPeriod::create([
            'name' => now()->format('F Y'),
            'type' => 'monthly',
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'status' => 'active',
        ]);

        // Create inventory items
        /** @var Collection<int, InventoryItem> $inventoryItems */
        $inventoryItems = InventoryItem::factory(50)->create();

        // Create some stock opname records for the current period
        foreach ($inventoryItems->take(20) as $item) {
            StockOpnameRecord::create([
                'stock_taking_period_id' => $currentPeriod->id,
                'inventory_item_id' => $item->id,
                'user_id' => collect([$stockTaker1->id, $stockTaker2->id])->random(),
                'qty_std' => $item->qty_std + random_int(-10, 10),
                'qty_sisa' => $item->qty_sisa + random_int(-5, 5),
                'remark' => collect([
                    null,
                    'Counted manually - all good',
                    'Some discrepancy noted',
                    'Verified by QR scan',
                    'Need recount next period'
                ])->random(),
                'method' => collect(['manual', 'qr_scan'])->random(),
                'counted_at' => now()->subHours(random_int(1, 168)),
            ]);
        }

        // Create records for completed period
        foreach ($inventoryItems->take(35) as $item) {
            StockOpnameRecord::create([
                'stock_taking_period_id' => $lastWeekPeriod->id,
                'inventory_item_id' => $item->id,
                'user_id' => collect([$stockTaker1->id, $stockTaker2->id])->random(),
                'qty_std' => $item->initial_qty_std + random_int(-15, 15),
                'qty_sisa' => $item->initial_qty_sisa + random_int(-8, 8),
                'remark' => collect([
                    null,
                    'Previous week count',
                    'Verified and confirmed',
                    'Standard recount procedure',
                ])->random(),
                'method' => collect(['manual', 'qr_scan'])->random(),
                'counted_at' => $lastWeekPeriod->start_date->addHours(random_int(1, 168)),
            ]);
        }

        // Update inventory items with latest stock opname data
        DB::statement('
            UPDATE inventory_items 
            SET qty_std = (
                SELECT sor.qty_std 
                FROM stock_opname_records sor 
                WHERE sor.inventory_item_id = inventory_items.id 
                ORDER BY sor.counted_at DESC 
                LIMIT 1
            ),
            qty_sisa = (
                SELECT sor.qty_sisa 
                FROM stock_opname_records sor 
                WHERE sor.inventory_item_id = inventory_items.id 
                ORDER BY sor.counted_at DESC 
                LIMIT 1
            ),
            remark = (
                SELECT sor.remark 
                FROM stock_opname_records sor 
                WHERE sor.inventory_item_id = inventory_items.id 
                ORDER BY sor.counted_at DESC 
                LIMIT 1
            )
            WHERE EXISTS (
                SELECT 1 FROM stock_opname_records sor 
                WHERE sor.inventory_item_id = inventory_items.id
            )
        ');
    }
}