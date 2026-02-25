<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Literacy Platform</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .navbar-brand {
            font-weight: bold;
        }
        .sidebar {
            height: 100vh;
            background: #0d6efd;
            color: #fff;
            padding-top: 1rem;
        }
        .sidebar a {
            color: #fff;
            display: block;
            padding: 10px 15px;
            text-decoration: none;
        }
        .sidebar a:hover {
            background: #0b5ed7;
        }
        .content {
            padding: 2rem;
        }
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Digital Literacy</a>
            <div class="d-flex">
                <a href="#" class="btn btn-light btn-sm">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container-fluid">
        <div class="row">

            <!-- Sidebar -->
            <div class="col-md-2 sidebar">
                <h5 class="text-center mb-4">Menu</h5>
                <a href="/admin/dashboard"><i class="bi bi-speedometer2"></i> Dashboard</a>
                <a href="/admin/students"><i class="bi bi-people"></i> Students</a>
                <a href="/admin/documents"><i class="bi bi-file-earmark-text"></i> Documents</a>>
                <hr>
                <a href="/student/dashboard"><i class="bi bi-person"></i> Student View</a>
            </div>

            <!-- Main Content -->
            <div class="col-md-10 content">
                @yield('content')
            </div>

        </div>
    </div>

</body>
</html>
