<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'];
        $types = ['Raw Material', 'Component', 'Assembly', 'Finished Good'];
        $storages = ['A-01-01', 'A-01-02', 'B-02-01', 'B-02-02', 'C-03-01', 'C-03-02'];
        $suppliers = [
            ['code' => 'SUP001', 'name' => 'PT Supplier Utama'],
            ['code' => 'SUP002', 'name' => 'CV Material Prima'],
            ['code' => 'SUP003', 'name' => 'PT Komponen Jaya'],
        ];

        $supplier = $this->faker->randomElement($suppliers);
        $initialQtyStd = $this->faker->numberBetween(0, 1000);
        $initialQtySisa = $this->faker->numberBetween(0, $initialQtyStd);

        return [
            'no' => $this->faker->unique()->numberBetween(1000, 9999),
            'part' => 'P' . $this->faker->unique()->numberBetween(10000, 99999),
            'std_pack' => $this->faker->numberBetween(1, 100),
            'project' => $this->faker->randomElement($projects),
            'part_name' => $this->faker->words(3, true) . ' ' . $this->faker->randomElement(['Bolt', 'Screw', 'Plate', 'Wire', 'Cable']),
            'part_number' => 'PN-' . $this->faker->unique()->bothify('##??####'),
            'storage' => $this->faker->randomElement($storages),
            'supplier_code' => $supplier['code'],
            'supplier_name' => $supplier['name'],
            'type' => $this->faker->randomElement($types),
            'image' => null,
            'initial_qty_std' => $initialQtyStd,
            'initial_qty_sisa' => $initialQtySisa,
            'initial_remark' => $this->faker->optional(0.3)->sentence(),
            'qty_std' => $initialQtyStd,
            'qty_sisa' => $initialQtySisa,
            'remark' => $this->faker->optional(0.3)->sentence(),
        ];
    }
}