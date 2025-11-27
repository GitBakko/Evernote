$baseUrl = "http://localhost:3001/api"
$email = "bakko.posta@gmail.com"
$password = "badbad"

# 1. Login
try {
  $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
  $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
  $token = $loginResponse.token
  Write-Host "Login Successful"
}
catch {
  Write-Error "Login Failed: $_"
  exit 1
}

$headers = @{ Authorization = "Bearer $token" }

# 2. Get Notebooks
$notebooks = Invoke-RestMethod -Uri "$baseUrl/notebooks" -Method Get -Headers $headers
$notebookId = $notebooks[0].id

# 3. Create Note
$noteId = [Guid]::NewGuid().ToString()
$noteBody = @{ 
  title      = "Sync Test Note"; 
  content    = "Initial Content"; 
  notebookId = $notebookId;
  id         = $noteId 
} | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/notes" -Method Post -Body $noteBody -ContentType "application/json" -Headers $headers
Write-Host "Note Created: $noteId"

# 4. Update Note (Simulate Sync Push)
try {
  $updateBody = @{ 
    title      = "Updated Content"; 
    content    = "Synced Content";
    notebookId = $notebookId
  } | ConvertTo-Json
  Invoke-RestMethod -Uri "$baseUrl/notes/$noteId" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
  Write-Host "Note Updated Successfully"
}
catch {
  Write-Error "Update Note Failed: $_"
  exit 1
}
