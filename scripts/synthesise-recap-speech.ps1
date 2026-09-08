$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.Rate = -1
$jobs = Get-Content -Encoding UTF8 -LiteralPath '.private/media-jobs.json' -Raw | ConvertFrom-Json
$lastLesson = ''
foreach ($job in $jobs) {
  $target = [IO.Path]::GetFullPath($job.wav)
  if (-not (Test-Path -LiteralPath $target)) {
    if ($job.speaker -eq 'Host') { $voice.SelectVoice('Microsoft David Desktop') } else { $voice.SelectVoice('Microsoft Zira Desktop') }
    $spoken = $job.text.Replace('–', ' ').Replace('−', 'minus ').Replace('→', ' to ')
    foreach ($term in @('ATP','AMP','DNA','RNA','GFR','ADH','ACTH','TSH','FSH','LH','PCR','CNS','PNS','GIRK','AV','SA')) {
      $letters = ($term.ToCharArray() -join ' ')
      $spoken = [regex]::Replace($spoken, '\b'+$term+'\b', $letters)
    }
    $voice.SetOutputToWaveFile($target)
    $voice.Speak($spoken)
    $voice.SetOutputToNull()
  }
  if ($job.lessonId -ne $lastLesson) { Write-Output ('Narrating '+$job.lessonId); $lastLesson=$job.lessonId }
}
$voice.Dispose()
