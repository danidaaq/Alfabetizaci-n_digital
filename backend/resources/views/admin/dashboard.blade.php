@extends('layouts.app')
@section('content')
<h2>Administrator Dashboard</h2>
<p class="text-muted">Manage the digital literacy program.</p>

<div class="row mt-4">
    <div class="col-md-3">
        <div class="card text-center shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Students</h5>
                <p class="display-6">120</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card text-center shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Activities</h5>
                <p class="display-6">15</p>
            </div>
        </div>
    </div>
</div>
@endsection
