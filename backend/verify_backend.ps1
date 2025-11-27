$baseUrl = "http://localhost:3001/api"
$email = "bakko.posta@gmail.com"
$password = "badbad"
$recipientEmail = "recipient-verified-final@example.com"

# 1. Login
try {
    $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login Successful. Token: $token"
} catch {
    Write-Error "Login Failed: $_"
    exit 1
}

$headers = @{ Authorization = "Bearer $token" }

# 2. Get Notebooks (to get a valid notebookId)
try {
    $notebooks = Invoke-RestMethod -Uri "$baseUrl/notebooks" -Method Get -Headers $headers
    if ($notebooks.Count -eq 0) {
        Write-Error "No notebooks found. Cannot create note."
        exit 1
    }
    $notebookId = $notebooks[0].id
    Write-Host "Using Notebook ID: $notebookId"
} catch {
    Write-Error "Get Notebooks Failed: $_"
    exit 1
}

# 3. Create Note (with explicit ID)
$noteId = [Guid]::NewGuid().ToString()
try {
    $noteBody = @{ 
        title = "API Test Note"; 
        content = "Created via PowerShell"; 
        notebookId = $notebookId;
        id = $noteId 
    } | ConvertTo-Json
    $note = Invoke-RestMethod -Uri "$baseUrl/notes" -Method Post -Body $noteBody -ContentType "application/json" -Headers $headers
    Write-Host "Note Created. ID: $($note.id)"
} catch {
    Write-Error "Create Note Failed: $_"
    exit 1
}

# 4. Share Note
try {
    $shareBody = @{ email = $recipientEmail; permission = "READ" } | ConvertTo-Json
    $shareResponse = Invoke-RestMethod -Uri "$baseUrl/share/notes/$noteId" -Method Post -Body $shareBody -ContentType "application/json" -Headers $headers
    Write-Host "Note Shared Successfully: $($shareResponse | ConvertTo-Json -Depth 2)"
} catch {
    Write-Error "Share Note Failed: $_"
    exit 1
}
