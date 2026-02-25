@extends('layouts.app')
@section('content')
<div class="container">
    <h2>Welcome, Student 👋</h2>
    <p class="text-muted">This is your dashboard. Here you can check your progress, documents and activities.</p>

    <div class="row mt-4">
        <div class="col-md-3">
            <div class="card text-center shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Activities</h5>
                    <p class="card-text">View and complete learning activities.</p>
                    <a href="/student/activities" class="btn btn-primary">Go</a>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card text-center shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Documents</h5>
                    <p class="card-text">Access materials uploaded by your instructor.</p>
                    <a href="/student/documents" class="btn btn-primary">Go</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
