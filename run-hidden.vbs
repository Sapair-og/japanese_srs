Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c npm run dev -- --open", 0, false
