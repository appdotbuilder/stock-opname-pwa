<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\StockOpnameRecord
 *
 * @property int $id
 * @property int $stock_taking_period_id
 * @property int $inventory_item_id
 * @property int $user_id
 * @property int $qty_std
 * @property int $qty_sisa
 * @property string|null $remark
 * @property string $method
 * @property \Illuminate\Support\Carbon $counted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\StockTakingPeriod $stockTakingPeriod
 * @property-read \App\Models\InventoryItem $inventoryItem
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereStockTakingPeriodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereInventoryItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereQtyStd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereQtySisa($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereRemark($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereCountedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockOpnameRecord whereUpdatedAt($value)
 * @method static \Database\Factories\StockOpnameRecordFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class StockOpnameRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'stock_taking_period_id',
        'inventory_item_id',
        'user_id',
        'qty_std',
        'qty_sisa',
        'remark',
        'method',
        'counted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stock_taking_period_id' => 'integer',
        'inventory_item_id' => 'integer',
        'user_id' => 'integer',
        'qty_std' => 'integer',
        'qty_sisa' => 'integer',
        'counted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the stock taking period for this record.
     */
    public function stockTakingPeriod(): BelongsTo
    {
        return $this->belongsTo(StockTakingPeriod::class);
    }

    /**
     * Get the inventory item for this record.
     */
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }

    /**
     * Get the user who performed this stock taking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}