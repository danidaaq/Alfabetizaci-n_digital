@extends('layouts.app')
@section('content')
<h3>My Activities</h3>
<p class="text-muted">Here you can view and complete your assigned activities.</p>

<table class="table table-bordered mt-3">
    <thead class="table-primary">
        <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Score</th>
        </tr>
    </thead>
    <tbody>
        <!-- Example static row -->
        <tr>
            <td>Basic Computer Skills</td>
            <td>Quiz</td>
            <td>Identify computer parts</td>
            <td><span class="badge bg-success">Completed</span></td>
            <td>90</td>
        </tr>
    </tbody>
</table>
@endsection
