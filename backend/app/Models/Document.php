<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'file_path',
        'type',
        'uploaded_by',
    ];

    // Relación: un documento pertenece al usuario que lo subió (profesor)
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
