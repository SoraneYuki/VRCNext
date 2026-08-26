#define MyAppName      "SoraneYuki VRCNext"
#define MyAppVersion   "2026.46.5"
#define MyAppPublisher "SoraneYuki"
#define MyAppURL       "https://github.com/SoraneYuki/VRCNext"

[Setup]
AppId={{99451B8E-A96F-4D38-8D1D-C90BDB9D5FA7}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableDirPage=yes
DisableProgramGroupPage=yes
OutputDir=..\installer
OutputBaseFilename=SoraneYuki-VRCNext_Setup_{#MyAppVersion}_x64
SetupIconFile=..\logo.ico
WizardImageFile=installer_banner.png
WizardSmallImageFile=installer_small.png
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
MinVersion=10.0.19041
ArchitecturesInstallIn64BitMode=x64compatible
ArchitecturesAllowed=x64compatible

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"

[Files]
Source: "..\releases\SoraneYuki.VRCNext-win-Setup.exe"; DestDir: "{tmp}"; Flags: deleteafterinstall

[Run]
Filename: "{tmp}\SoraneYuki.VRCNext-win-Setup.exe"; Flags: waituntilterminated; StatusMsg: "Installing SoraneYuki VRCNext..."
