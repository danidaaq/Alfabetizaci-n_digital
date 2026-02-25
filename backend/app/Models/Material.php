<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Material extends Model
{
    use HasFactory;

    protected $table = 'materials';

    protected $fillable = [
        'title',
        'type',
        'url',
        'category',
        'uploaded_by',
    ];

    // Relación: quién subió el material
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // Alias por si alguna parte del código usa user()
    public function user()
    {
        return $this->uploader();
    }
}
