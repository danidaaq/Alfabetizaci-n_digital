<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'activity_id',
        'score',
        'completed',
    ];

    // Relación: un resultado pertenece a un estudiante
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación: un resultado pertenece a una actividad
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}
