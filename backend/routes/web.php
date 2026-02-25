<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// 🔹 ADMIN VIEWS
Route::prefix('admin')->group(function () {
    Route::view('/dashboard', 'admin.dashboard')->name('admin.dashboard');
    Route::view('/students', 'admin.students')->name('admin.students');
    Route::view('/documents', 'admin.documents')->name('admin.documents');
    Route::view('/reports', 'admin.reports')->name('admin.reports');
});

// 🔹 STUDENT VIEWS
Route::prefix('student')->group(function () {
    Route::view('/dashboard', 'students.dashboard')->name('student.dashboard');
    Route::view('/activities', 'students.activities')->name('student.activities');
    Route::view('/documents', 'students.documents')->name('student.documents');
    Route::view('/profile', 'students.profile')->name('student.profile');
});
