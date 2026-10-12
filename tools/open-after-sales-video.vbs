Set sh = CreateObject("WScript.Shell")
url = sh.Environment("PROCESS")("SALES_VIDEO_URL")
If Len(url) = 0 Then
  MsgBox "Set SALES_VIDEO_URL before opening the video library.", 48, "Sales Tool"
  WScript.Quit 1
End If
sh.Run "rundll32.exe url.dll,FileProtocolHandler " & Chr(34) & url & Chr(34), 1, False
