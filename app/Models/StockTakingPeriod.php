<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\StockTakingPeriod
 *
 * @property int $id
 * @property string $name
 * @property string $type
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon $end_date
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockOpnameRecord> $stockOpnameRecords
 * @property-read int|null $stock_opname_records_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTakingPeriod active()
 * @method static \Database\Factories\StockTakingPeriodFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class StockTakingPeriod extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'type',
        'start_date',
        'end_date',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the stock opname records for this period.
     */
    public function stockOpnameRecords(): HasMany
    {
        return $this->hasMany(StockOpnameRecord::class);
    }

    /**
     * Scope a query to only include active periods.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}