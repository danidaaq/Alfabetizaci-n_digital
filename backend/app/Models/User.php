<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Atributos que se pueden asignar masivamente.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // admin o student
    ];

    /**
     * Atributos ocultos al serializar.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Atributos con casting de tipo.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Verifica si el usuario es administrador.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Verifica si el usuario es estudiante.
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Relación: un usuario puede tener muchos registros de asistencia.
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Relación: un usuario (estudiante) puede tener muchos resultados de actividades.
     */
    public function activityResults()
    {
        return $this->hasMany(ActivityResult::class);
    }

    /**
     * Relación: un usuario puede tener muchos documentos subidos.
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Relación: un usuario (admin o docente) puede crear muchas actividades.
     */
    public function activities()
    {
        return $this->hasMany(Activity::class, 'created_by');
    }
}
