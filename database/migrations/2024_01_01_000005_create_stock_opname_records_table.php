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
        Schema::create('stock_opname_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_taking_period_id')->constrained()->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('qty_std')->comment('Counted standard quantity');
            $table->integer('qty_sisa')->comment('Counted remaining quantity');
            $table->text('remark')->nullable()->comment('Stock taking remarks');
            $table->enum('method', ['qr_scan', 'manual'])->default('manual')->comment('Stock taking method');
            $table->timestamp('counted_at')->comment('When the stock count was performed');
            $table->timestamps();
            
            $table->index(['stock_taking_period_id', 'inventory_item_id']);
            $table->index('user_id');
            $table->index('counted_at');
            $table->unique(['stock_taking_period_id', 'inventory_item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opname_records');
    }
};