param(
    [Parameter(Mandatory=$true)][string]$Executable,
    [Parameter(Mandatory=$true)][string]$Icon
)
$ErrorActionPreference = 'Stop'
if (-not ('SalesExecutableIcon' -as [type])) {
Add-Type -TypeDefinition @'
using System;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;

public static class SalesExecutableIcon {
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    static extern IntPtr LoadLibraryEx(string file, IntPtr reserved, uint flags);
    [DllImport("kernel32.dll")] static extern bool FreeLibrary(IntPtr module);
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    static extern IntPtr FindResourceEx(IntPtr module, IntPtr type, IntPtr name, ushort language);
    [DllImport("kernel32.dll")] static extern uint SizeofResource(IntPtr module, IntPtr resource);
    [DllImport("kernel32.dll")] static extern IntPtr LoadResource(IntPtr module, IntPtr resource);
    [DllImport("kernel32.dll")] static extern IntPtr LockResource(IntPtr resource);
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    static extern IntPtr BeginUpdateResource(string file, bool deleteExisting);
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    static extern bool UpdateResource(IntPtr update, IntPtr type, IntPtr name, ushort language, byte[] data, uint size);
    [DllImport("kernel32.dll", SetLastError=true)]
    static extern bool EndUpdateResource(IntPtr update, bool discard);

    // shortcut: Electron uses icon group 1/en-US; fail on other layouts until a runtime change needs them.
    static byte[] Read(string file, int type, int id) {
        IntPtr module = LoadLibraryEx(file, IntPtr.Zero, 2);
        if (module == IntPtr.Zero) throw new Win32Exception();
        try {
            IntPtr resource = FindResourceEx(module, (IntPtr)type, (IntPtr)id, 1033);
            if (resource == IntPtr.Zero) throw new Win32Exception();
            byte[] bytes = new byte[SizeofResource(module, resource)];
            Marshal.Copy(LockResource(LoadResource(module, resource)), bytes, 0, bytes.Length);
            return bytes;
        } finally { FreeLibrary(module); }
    }

    public static void Set(string file, string icon) {
        byte[] raw = File.ReadAllBytes(icon);
        if (raw.Length < 6 || BitConverter.ToUInt16(raw, 0) != 0 || BitConverter.ToUInt16(raw, 2) != 1)
            throw new InvalidDataException("Invalid ICO header.");
        int count = BitConverter.ToUInt16(raw, 4);
        if (count == 0 || raw.Length < 6 + count * 16) throw new InvalidDataException("Invalid ICO directory.");
        byte[] group = new byte[6 + count * 14];
        Array.Copy(raw, group, 6);
        byte[][] images = new byte[count][];
        for (int i = 0; i < count; i++) {
            int entry = 6 + i * 16;
            uint size = BitConverter.ToUInt32(raw, entry + 8), offset = BitConverter.ToUInt32(raw, entry + 12);
            if (size == 0 || offset < 6 + count * 16 || (ulong)offset + size > (ulong)raw.Length)
                throw new InvalidDataException("Invalid ICO image range.");
            images[i] = new byte[size];
            Array.Copy(raw, offset, images[i], 0, size);
            Array.Copy(raw, entry, group, 6 + i * 14, 12);
            Array.Copy(BitConverter.GetBytes((ushort)(i + 1)), 0, group, 18 + i * 14, 2);
        }
        Read(file, 14, 1);
        IntPtr update = BeginUpdateResource(file, false);
        if (update == IntPtr.Zero) throw new Win32Exception();
        try {
            for (int i = 0; i < count; i++) {
                if (!UpdateResource(update, (IntPtr)3, (IntPtr)(i + 1), 1033, images[i], (uint)images[i].Length)) throw new Win32Exception();
            }
            if (!UpdateResource(update, (IntPtr)14, (IntPtr)1, 1033, group, (uint)group.Length)) throw new Win32Exception();
            bool saved = EndUpdateResource(update, false);
            update = IntPtr.Zero;
            if (!saved) throw new Win32Exception();
        } finally { if (update != IntPtr.Zero) EndUpdateResource(update, true); }
        if (!Read(file, 14, 1).SequenceEqual(group)) throw new InvalidDataException("Icon group verification failed.");
        for (int i = 0; i < count; i++) {
            if (!Read(file, 3, i + 1).SequenceEqual(images[i])) throw new InvalidDataException("Icon image verification failed.");
        }
    }
}
'@
}
[SalesExecutableIcon]::Set((Resolve-Path -LiteralPath $Executable).Path, (Resolve-Path -LiteralPath $Icon).Path)
Write-Output 'Executable icon embedded and verified.'
