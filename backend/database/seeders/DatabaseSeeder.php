<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 🔹 Crear usuario administrador (profesor)
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@alfabetizacion.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // 🔹 Crear usuario estudiante
        User::create([
            'name' => 'Estudiante Prueba',
            'email' => 'estudiante@alfabetizacion.com',
            'password' => Hash::make('estudiante123'),
            'role' => 'student',
        ]);

        // Si deseas crear más usuarios aleatorios:
        // User::factory(5)->create();
    }
}
