Set shell = CreateObject("WScript.Shell")
quote = Chr(34)
command = quote & shell.ExpandEnvironmentStrings("%SystemRoot%") & "\System32\WindowsPowerShell\v1.0\powershell.exe" & quote & " -NoProfile -NonInteractive -ExecutionPolicy Bypass -File " & quote & WScript.Arguments(0) & quote & " -JobPath " & quote & WScript.Arguments(1) & quote
WScript.Quit shell.Run(command, 0, True)
