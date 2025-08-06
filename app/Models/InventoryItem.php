<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\InventoryItem
 *
 * @property int $id
 * @property int $no
 * @property string $part
 * @property int $std_pack
 * @property string $project
 * @property string $part_name
 * @property string $part_number
 * @property string $storage
 * @property string|null $supplier_code
 * @property string|null $supplier_name
 * @property string $type
 * @property string|null $image
 * @property int $initial_qty_std
 * @property int $initial_qty_sisa
 * @property string|null $initial_remark
 * @property int $qty_std
 * @property int $qty_sisa
 * @property string|null $remark
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockOpnameRecord> $stockOpnameRecords
 * @property-read int|null $stock_opname_records_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem wherePart($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereStdPack($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereProject($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem wherePartName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem wherePartNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereStorage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereSupplierCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereSupplierName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereInitialQtyStd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereInitialQtySisa($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereInitialRemark($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereQtyStd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereQtySisa($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereRemark($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereUpdatedAt($value)
 * @method static \Database\Factories\InventoryItemFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class InventoryItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'no',
        'part',
        'std_pack',
        'project',
        'part_name',
        'part_number',
        'storage',
        'supplier_code',
        'supplier_name',
        'type',
        'image',
        'initial_qty_std',
        'initial_qty_sisa',
        'initial_remark',
        'qty_std',
        'qty_sisa',
        'remark',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'no' => 'integer',
        'std_pack' => 'integer',
        'initial_qty_std' => 'integer',
        'initial_qty_sisa' => 'integer',
        'qty_std' => 'integer',
        'qty_sisa' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the stock opname records for this item.
     */
    public function stockOpnameRecords(): HasMany
    {
        return $this->hasMany(StockOpnameRecord::class);
    }
}