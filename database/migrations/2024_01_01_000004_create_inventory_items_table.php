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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->integer('no')->comment('Item number');
            $table->string('part')->comment('Part identifier');
            $table->integer('std_pack')->comment('Standard pack quantity');
            $table->string('project')->comment('Project name');
            $table->string('part_name')->comment('Part name description');
            $table->string('part_number')->comment('Part number');
            $table->string('storage')->comment('Storage location');
            $table->string('supplier_code')->nullable()->comment('Supplier code');
            $table->string('supplier_name')->nullable()->comment('Supplier name');
            $table->string('type')->comment('Item type');
            $table->string('image')->nullable()->comment('Item image path');
            $table->integer('initial_qty_std')->default(0)->comment('Initial standard quantity');
            $table->integer('initial_qty_sisa')->default(0)->comment('Initial remaining quantity');
            $table->text('initial_remark')->nullable()->comment('Initial remarks');
            $table->integer('qty_std')->default(0)->comment('Current standard quantity');
            $table->integer('qty_sisa')->default(0)->comment('Current remaining quantity');
            $table->text('remark')->nullable()->comment('Current remarks');
            $table->timestamps();
            
            $table->index(['project', 'part']);
            $table->index('storage');
            $table->index('part_number');
            $table->unique(['part', 'storage']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};