@extends('layouts.app')
@section('content')
<h3>Documents Management</h3>
<p class="text-muted">Upload and manage course materials.</p>

<form class="mt-3">
    <div class="mb-3">
        <label class="form-label">Title</label>
        <input type="text" class="form-control" placeholder="Enter document title">
    </div>
    <div class="mb-3">
        <label class="form-label">File</label>
        <input type="file" class="form-control">
    </div>
    <button type="submit" class="btn btn-primary">Upload</button>
</form>

<hr>

<table class="table table-hover mt-4">
    <thead class="table-secondary">
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>File</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Digital Basics</td>
            <td>digital_basics.pdf</td>
            <td><button class="btn btn-sm btn-danger">Delete</button></td>
        </tr>
    </tbody>
</table>
@endsection
