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

' Si el servidor ya está corriendo, abre la ventana secundaria sin controlar el apagado
If ServerUp(url) Then
    OpenChrome base, url, fso, sh, q, False
    WScript.Quit 0
End If

' Variables de entorno del proceso
Set env = sh.Environment("PROCESS")
env("NODE_ENV")      = "production"
env("HOST")          = "127.0.0.1"
env("PORT")          = port
env("ORIGIN")        = url
env("DATABASE_PATH") = base & "\data\sistema.db"

sh.CurrentDirectory = base

' Lanza run.bat de forma 100% invisible (parámetro 0)
sh.Run q & base & "\run.bat" & q, 0, False

For i = 1 To 40
    WScript.Sleep 250
    If ServerUp(url) Then
        ' Esta instancia inició el servidor; controlará el apagado cuando finalice el proceso principal
        OpenChrome base, url, fso, sh, q, True
        WScript.Quit 0
    End If
Next

MsgBox "El servidor no respondio a tiempo. Revise logs\servidor.log", 16, "Sistema Cultores"
WScript.Quit 1

Function ServerUp(u)
    Dim http
    ServerUp = False
    On Error Resume Next
    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    http.SetTimeouts 500, 500, 500, 500
    http.Open "GET", u, False
    http.Send
    If Err.Number = 0 Then
        If http.Status > 0 Then ServerUp = True
    End If
    Err.Clear
    On Error GoTo 0
End Function

Sub OpenChrome(b, u, f, s, quote, isMaster)
    Dim candidates, chrome
    candidates = Array( _
        s.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Google\Chrome\Application\chrome.exe", _
        s.ExpandEnvironmentStrings("%ProgramFiles%") & "\Google\Chrome\Application\chrome.exe", _
        s.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Google\Chrome\Application\chrome.exe")

    For Each chrome In candidates
        If f.FileExists(chrome) Then
            If isMaster Then
                ' Instancia maestra: aguarda el cierre del proceso principal y detiene el servidor
                s.Run quote & chrome & quote & " --app=" & u & _
                      " --user-data-dir=" & quote & b & "\perfil-chrome" & quote & _
                      " --no-first-run --no-default-browser-check", 1, True
                s.Run quote & b & "\stop.bat" & quote, 0, True
            Else
                ' Instancia secundaria: abre la ventana en el proceso existente y finaliza limpiamente
                s.Run quote & chrome & quote & " --app=" & u & _
                      " --user-data-dir=" & quote & b & "\perfil-chrome" & quote & _
                      " --no-first-run --no-default-browser-check", 1, False
            End If
            Exit Sub
        End If
    Next

    s.Run u, 1, False
End Sub
