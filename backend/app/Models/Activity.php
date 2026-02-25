<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'questions',
        'answers',
        'resources',
        'created_by',
        'due_date',
    ];

    protected $casts = [
        'questions' => 'array',
        'answers' => 'array',
        'resources' => 'array',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function results()
    {
        return $this->hasMany(ActivityResult::class);
    }
}
