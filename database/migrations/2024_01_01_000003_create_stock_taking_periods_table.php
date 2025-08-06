<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_taking_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Period name (e.g., Week 1 2024, January 2024)');
            $table->enum('type', ['weekly', 'monthly'])->comment('Period type');
            $table->date('start_date')->comment('Period start date');
            $table->date('end_date')->comment('Period end date');
            $table->enum('status', ['active', 'completed', 'draft'])->default('draft')->comment('Period status');
            $table->timestamps();
            
            $table->index(['type', 'status']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_taking_periods');
    }
};