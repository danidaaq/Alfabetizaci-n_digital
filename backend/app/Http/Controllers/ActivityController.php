<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Activity;
use App\Models\ActivityResult;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;

class ActivityController extends Controller
{
    // ADMIN: listar actividades (con creador y cantidad de resultados)
    public function index()
    {
        $activities = Activity::with('creator:id,name')
            ->withCount('results')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($activities, 200);
    }

    // ADMIN: mostrar una actividad
    public function show($id)
    {
        $activity = Activity::with('creator:id,name')->findOrFail($id);

        // decode fields
        $activity->questions = $activity->questions ? json_decode($activity->questions, true) : null;
        $activity->answers = $activity->answers ? json_decode($activity->answers, true) : null;
        $activity->resources = $activity->resources ? json_decode($activity->resources, true) : null;

        // normalizar recursos a URLs (si es path relativo lo convertimos a asset)
        if (is_array($activity->resources)) {
            $activity->resources = array_map(function ($r) {
                if (is_array($r) && isset($r['path'])) {
                    $path = $r['path'];
                    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                        $r['url'] = $path;
                    } else {
                        $r['url'] = asset('storage/' . ltrim($path, '/'));
                    }
                }
                return $r;
            }, $activity->resources);
        }

        return response()->json($activity, 200);
    }

    // ADMIN: crear actividad (images[], docs[], questions array for quiz)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            // type flexible: quiz, image, document, link, other
            'type' => ['required', 'string'],
            'description' => 'nullable|string',
            'questions' => 'nullable',
            'answers' => 'nullable',
            'images.*' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:5120', // 5MB each
            // allow ppt/pptx as documents too
            'docs.*' => 'nullable|file|mimes:pdf,doc,docx,txt,ppt,pptx,xls,xlsx|max:51200', // up to 50MB each (ajustable)
            'link' => 'nullable|url',
        ]);

        $resources = [];

        // Guardar imágenes (opcional)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store('activities/images', 'public');
                $resources[] = ['type' => 'image','url' => asset('storage/' . $path)];

            }
        }

        // Guardar documentos (opcional)
        if ($request->hasFile('docs')) {
            foreach ($request->file('docs') as $doc) {
                $path = $doc->store('activities/docs', 'public');
                $resources[] = ['type' => 'document','url' => asset('storage/' . $path)];

            }
        }

        // Si envían link (actividad de tipo link)
        if ($request->filled('link')) {
            $resources[] = ['type' => 'link', 'url' => $request->link];
        }

        $questions = null;
        $answers = null;

        if ($request->filled('questions')) {
            $q = $request->questions;
            if (is_string($q)) {
                $q = json_decode($q, true);
            }
            $questions = $q;
        }

        if ($request->filled('answers')) {
            $a = $request->answers;
            if (is_string($a)) {
                $a = json_decode($a, true);
            }
            $answers = $a;
        }


        $activity = Activity::create([
            'title' => $request->title,
            'type' => $request->type,
            'description' => $request->description,
            'questions' => $questions ? json_encode($questions, JSON_UNESCAPED_UNICODE) : null,
            'answers' => $answers ? json_encode($answers, JSON_UNESCAPED_UNICODE) : null,
            'resources' => !empty($resources) ? json_encode($resources, JSON_UNESCAPED_UNICODE) : null,
            'created_by' => optional($request->user())->id,
        ]);

        return response()->json([
            'message' => 'Actividad creada correctamente',
            'activity' => $activity,
        ], 201);
    }

    // ADMIN: eliminar actividad
    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);

        // borrar archivos físicos si existieran en resources
        if ($activity->resources) {
            $resources = json_decode($activity->resources, true);
            if (is_array($resources)) {
                foreach ($resources as $r) {
                    if (isset($r['path']) && !str_starts_with($r['path'], 'http')) {
                        // eliminar del disco public
                        Storage::disk('public')->delete($r['path']);
                    }
                }
            }
        }

        $activity->delete();

        return response()->json(['message' => 'Actividad eliminada correctamente']);
    }

    // STUDENT: listar actividades disponibles (incluye resultado del estudiante si existe)
    public function getByStudent(Request $request)
    {
        $userId = $request->user()->id;

        $activities = Activity::select('id', 'title', 'type', 'description', 'questions', 'answers', 'resources', 'created_by', 'due_date')
            ->with(['results' => function ($q) use ($userId) {
                $q->where('student_id', $userId)->select('id', 'activity_id', 'score', 'completed', 'answers');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        // decode fields and convert resources paths -> urls
        $activities->transform(function ($act) {
            $act->questions = $act->questions ? json_decode($act->questions, true) : null;
            $act->answers = $act->answers ? json_decode($act->answers, true) : null;
            $act->resources = $act->resources ? json_decode($act->resources, true) : null;

            if (is_array($act->resources)) {
                $act->resources = array_map(function ($r) {
                    if (is_array($r) && isset($r['path'])) {
                        $path = $r['path'];
                        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                            $r['url'] = $path;
                        } else {
                            $r['url'] = asset('storage/' . ltrim($path, '/'));
                        }
                    }
                    return $r;
                }, $act->resources);
            }

            return $act;
        });

        return response()->json($activities, 200);
    }

    // STUDENT: enviar resultado / marcar completado
    // aceptamos POST /student/activities/{id}/submit (según tus rutas)
    public function submitActivity(Request $request, $id = null)
    {
        $activityId = $id ?? $request->input('activity_id');

        $request->merge(['activity_id' => $activityId]);

        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'answers' => 'nullable|array',
        ]);

        $userId = $request->user()->id;

        $activity = Activity::findOrFail($activityId);

        $score = null;

        // 🔥 CALIFICACIÓN AUTOMÁTICA SI ES QUIZ
        if ($activity->type === 'quiz' && $request->filled('answers')) {
            $correctAnswers = json_decode($activity->answers, true);
            $studentAnswers = $request->answers;

            $total = count($correctAnswers);
            $correct = 0;

            foreach ($correctAnswers as $i => $correctIndex) {
                if (
                    isset($studentAnswers[$i]) &&
                    (int)$studentAnswers[$i] === (int)$correctIndex
                ) {
                    $correct++;
                }
            }

            $score = round(($correct / max($total, 1)) * 100);
        }

        $result = ActivityResult::updateOrCreate(
            [
                'student_id' => $userId,
                'activity_id' => $activityId
            ],
            [
                'score' => $score,
                'completed' => true,
                'answers' => $request->filled('answers')
                    ? json_encode($request->answers, JSON_UNESCAPED_UNICODE)
                    : null,
            ]
        );

        return response()->json([
            'message' => 'Actividad enviada correctamente',
            'result' => $result,
        ], 200);
    }


    // ADMIN: calificar manualmente un resultado (optional)
    public function gradeResult(Request $request, $id)
    {
        // $id => activity id
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'score' => 'required|numeric|min:0|max:100',
        ]);

        $result = ActivityResult::where('activity_id', $id)
            ->where('student_id', $request->student_id)
            ->firstOrFail();

        $result->score = $request->score;
        $result->save();

        return response()->json(['message' => 'Calificación guardada', 'result' => $result]);
    }
}
