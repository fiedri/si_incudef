Option Explicit

Dim fso, sh, base, nodeExe, url, port, q, i, env
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh  = CreateObject("WScript.Shell")

base = fso.GetParentFolderName(WScript.ScriptFullName)
port = "3000"
url  = "http://127.0.0.1:" & port
q    = Chr(34)

nodeExe = base & "\runtime\node.exe"
If Not fso.FileExists(nodeExe) Then
    MsgBox "Falta runtime\node.exe. Ejecute instalar.bat primero.", 16, "Sistema Cultores"
    WScript.Quit 1
End If

If ServerUp(url) Then
    OpenChrome base, url, fso, sh, q
    WScript.Quit 0
End If

Set env = sh.Environment("PROCESS")
env("NODE_ENV") = "production"
env("HOST")     = "127.0.0.1"
env("PORT")     = port
env("ORIGIN")   = url
env("DB_PATH")  = base & "\data\sistema.db"

sh.CurrentDirectory = base
sh.Run "cmd /c " & q & q & nodeExe & q & " " & q & base & "\app\build\index.js" & q & _
       " >> " & q & base & "\logs\servidor.log" & q & " 2>&1" & q, 0, False

' Esperar hasta 10 segundos a que el puerto responda.
For i = 1 To 40
    WScript.Sleep 250
    If ServerUp(url) Then
        OpenChrome base, url, fso, sh, q
        WScript.Quit 0
    End If
Next

MsgBox "El servidor no respondio. Revise logs\servidor.log", 16, "Sistema Cultores"
WScript.Quit 1

Function ServerUp(u)
    Dim http
    ServerUp = False
    On Error Resume Next
    Set http = CreateObject("MSXML2.XMLHTTP")
    http.Open "GET", u, False
    http.Send
    If Err.Number = 0 Then
        If http.Status >= 200 And http.Status < 500 Then ServerUp = True
    End If
    Err.Clear
    On Error GoTo 0
End Function

Sub OpenChrome(b, u, f, s, quote)
    Dim candidates, chrome
    candidates = Array( _
        s.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Google\Chrome\Application\chrome.exe", _
        s.ExpandEnvironmentStrings("%ProgramFiles%") & "\Google\Chrome\Application\chrome.exe", _
        s.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Google\Chrome\Application\chrome.exe")

    For Each chrome In candidates
        If f.FileExists(chrome) Then
            s.Run quote & chrome & quote & " --app=" & u & _
                  " --user-data-dir=" & quote & b & "\perfil-chrome" & quote & _
                  " --no-first-run --no-default-browser-check", 1, False
            Exit Sub
        End If
    Next

    ' Si no hay Chrome, que abra el navegador por defecto.
    s.Run u, 1, False
End Sub
