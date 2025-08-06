<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockOpnameRequest extends FormRequest
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
            'qty_std' => 'required|integer|min:0',
            'qty_sisa' => 'required|integer|min:0',
            'remark' => 'nullable|string|max:1000',
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
            'qty_std.required' => 'Standard quantity is required.',
            'qty_std.integer' => 'Standard quantity must be a number.',
            'qty_std.min' => 'Standard quantity cannot be negative.',
            'qty_sisa.required' => 'Remaining quantity is required.',
            'qty_sisa.integer' => 'Remaining quantity must be a number.',
            'qty_sisa.min' => 'Remaining quantity cannot be negative.',
        ];
    }
}