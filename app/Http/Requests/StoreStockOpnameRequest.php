<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockOpnameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->canTakeStock();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'stock_taking_period_id' => 'required|exists:stock_taking_periods,id',
            'qty_std' => 'required|integer|min:0',
            'qty_sisa' => 'required|integer|min:0',
            'remark' => 'nullable|string|max:1000',
            'method' => 'required|in:manual,qr_scan',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'inventory_item_id.required' => 'Please select an inventory item.',
            'inventory_item_id.exists' => 'Selected inventory item is invalid.',
            'stock_taking_period_id.required' => 'Stock taking period is required.',
            'stock_taking_period_id.exists' => 'Selected stock taking period is invalid.',
            'qty_std.required' => 'Standard quantity is required.',
            'qty_std.integer' => 'Standard quantity must be a number.',
            'qty_std.min' => 'Standard quantity cannot be negative.',
            'qty_sisa.required' => 'Remaining quantity is required.',
            'qty_sisa.integer' => 'Remaining quantity must be a number.',
            'qty_sisa.min' => 'Remaining quantity cannot be negative.',
            'method.required' => 'Stock taking method is required.',
            'method.in' => 'Invalid stock taking method selected.',
        ];
    }
}