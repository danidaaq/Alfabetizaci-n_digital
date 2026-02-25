<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Material;

class DocumentController extends Controller
{
    /**
     * Mostrar todos los materiales (para admin)
     */
    public function index()
    {
        // traer el uploader a través de la relación 'user' (uploaded_by)
        $materials = Material::with('user:id,name')->orderBy('created_at', 'desc')->get();

        return response()->json($materials);
    }

    /**
     * Subir un material (archivo o enlace)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'nullable|file|max:51200', // 50MB (en bytes: depende de php.ini también)
            'link' => 'nullable|url',
            'category' => 'nullable|string|max:100',
        ]);

        $url = null;
        $type = 'file';

        // Si el request trae archivo
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('materials', 'public'); // storage/app/public/materials/...
            $url = asset('storage/' . $path);
            $type = 'file';
        }
        // si trae link
        elseif ($request->filled('link')) {
            $url = $request->input('link');
            $type = (str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be')) ? 'video' : 'link';
        }

        if (!$url) {
            return response()->json(['message' => 'Debes subir un archivo o incluir un enlace válido.'], 422);
        }

        $material = Material::create([
            'title' => $request->title,
            'type' => $type,
            'url' => $url,
            'category' => $request->category, // guardamos el tipo manual del admin
            'uploaded_by' => $request->user()->id ?? null,
        ]);

        return response()->json($material, 201);
    }

    /**
     * Mostrar materiales para estudiantes
     */
    public function getByStudent()
    {
        $materials = Material::orderBy('created_at', 'desc')->get();
        return response()->json($materials);
    }

    /**
     * Eliminar material
     */
    public function destroy($id)
    {
        $material = Material::findOrFail($id);

        // Borrar archivo físico si es tipo 'file'
        if ($material->type === 'file' && str_contains($material->url, 'storage/')) {
            $filePath = str_replace(asset('storage/') . '/', '', $material->url);
            Storage::disk('public')->delete($filePath);
        }

        $material->delete();

        return response()->json(['message' => 'Material eliminado correctamente']);
    }
}
