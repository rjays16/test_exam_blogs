<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'status',
        'created_by',
    ];

    /**
     * Get the user that created the blog.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}