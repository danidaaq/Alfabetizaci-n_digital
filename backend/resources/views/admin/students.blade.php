@extends('layouts.app')
@section('content')
<h3>Students Management</h3>
<p class="text-muted">List and manage enrolled students.</p>

<table class="table table-striped mt-3">
    <thead class="table-primary">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Attendance</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Maria Lopez</td>
            <td>maria@example.com</td>
            <td><span class="badge bg-success">Present</span></td>
            <td><button class="btn btn-sm btn-danger">Remove</button></td>
        </tr>
    </tbody>
</table>
@endsection
