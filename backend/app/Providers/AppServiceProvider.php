<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Evita errores de longitud en MySQL
        Schema::defaultStringLength(191);

        // Ejecuta migraciones automáticamente en producción (Render)
        if (app()->environment('production')) {
            Artisan::call('migrate', ['--force' => true]);
        }
    }
}