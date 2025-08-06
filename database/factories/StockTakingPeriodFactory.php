<?php

namespace Database\Factories;

use App\Models\StockTakingPeriod;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockTakingPeriod>
 */
class StockTakingPeriodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['weekly', 'monthly']);
        $startDate = $this->faker->dateTimeBetween('-3 months', 'now');
        $endDate = $type === 'weekly' 
            ? (clone $startDate)->modify('+1 week')
            : (clone $startDate)->modify('+1 month');

        return [
            'name' => $type === 'weekly' 
                ? 'Week ' . $this->faker->numberBetween(1, 52) . ' ' . $startDate->format('Y')
                : $startDate->format('F Y'),
            'type' => $type,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => $this->faker->randomElement(['draft', 'active', 'completed']),
        ];
    }

    /**
     * Indicate that the period is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the period is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}