<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Título del material

            // Cambiamos enum por string para permitir más tipos (file, link, video)
            $table->string('type', 20)->default('file');

            $table->string('url'); // Ruta del archivo o enlace externo
            $table->string('category')->nullable(); // tipo definido por el administrador (video, página, documento, etc.)
            $table->unsignedBigInteger('uploaded_by')->nullable(); // Usuario que subió el material
            $table->timestamps();

            // Relación con la tabla users
            $table->foreign('uploaded_by')
                ->references('id')->on('users')
                ->onDelete('set null');

            // Índices para búsquedas más rápidas
            $table->index(['type', 'uploaded_by']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
