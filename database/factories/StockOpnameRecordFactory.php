<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use App\Models\StockOpnameRecord;
use App\Models\StockTakingPeriod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockOpnameRecord>
 */
class StockOpnameRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'stock_taking_period_id' => StockTakingPeriod::factory(),
            'inventory_item_id' => InventoryItem::factory(),
            'user_id' => User::factory(),
            'qty_std' => $this->faker->numberBetween(0, 1000),
            'qty_sisa' => $this->faker->numberBetween(0, 500),
            'remark' => $this->faker->optional(0.4)->sentence(),
            'method' => $this->faker->randomElement(['manual', 'qr_scan']),
            'counted_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }

    /**
     * Indicate that the record was created via QR scan.
     */
    public function qrScan(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'qr_scan',
        ]);
    }

    /**
     * Indicate that the record was created manually.
     */
    public function manual(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'manual',
        ]);
    }
}