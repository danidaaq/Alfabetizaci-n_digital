@extends('layouts.app')
@section('content')
<h3>My Profile</h3>
<p class="text-muted">Review your personal information.</p>

<div class="card mt-3 shadow-sm">
    <div class="card-body">
        <h5>Name: John Doe</h5>
        <p>Email: johndoe@example.com</p>
        <p>Role: Student</p>
        <button class="btn btn-primary">Edit Profile</button>
    </div>
</div>
@endsection
