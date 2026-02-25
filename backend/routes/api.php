<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controladores
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ActivityController;

/*
|-------------------------------------------------------------------------- 
| API Routes
|-------------------------------------------------------------------------- 
*/

// Ruta de prueba
Route::get('/ping', function () {
    return response()->json(['message' => '✅ API funcionando correctamente']);
});

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    // General
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Activities (admin)
    Route::get('/admin/activities', [ActivityController::class, 'index']);
    Route::post('/admin/activities', [ActivityController::class, 'store']);
    Route::get('/admin/activities/{id}', [ActivityController::class, 'show']);
    //Route::put('/admin/activities/{id}', [ActivityController::class, 'update'] ?? []); // si no implementas update, deja
    Route::delete('/admin/activities/{id}', [ActivityController::class, 'destroy']);
    Route::post('/admin/activities/{id}/grade', [ActivityController::class, 'gradeResult']);

    // Materials
    Route::get('/admin/materials', [DocumentController::class, 'index']);
    Route::post('/admin/materials', [DocumentController::class, 'store']);
    Route::delete('/admin/materials/{id}', [DocumentController::class, 'destroy']);

    // Student
    Route::get('/student/materials', [DocumentController::class, 'getByStudent']);
    Route::get('/student/activities', [ActivityController::class, 'getByStudent']);
    // submit para estudiante (nota / marcar completado)
    Route::post('/student/activities/{id}/submit', [ActivityController::class, 'submitActivity']);
});
