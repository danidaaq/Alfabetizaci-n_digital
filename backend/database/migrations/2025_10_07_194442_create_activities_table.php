<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('quiz'); // más flexible
            $table->json('questions')->nullable(); // preguntas (solo si es quiz)
            $table->json('answers')->nullable(); // respuestas correctas
            $table->json('resources')->nullable(); // imágenes o documentos asociados
            $table->unsignedBigInteger('created_by');
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->foreign('created_by')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
