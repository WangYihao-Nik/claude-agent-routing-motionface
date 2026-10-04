# Agent Dispatch — Remotion segment

A 5.7-second, 1920 × 1080 Remotion animation for the 8.3–14.0 second passage of the supplied SRT. The scene follows one request through a hand-drawn editor workspace: the CEO Agent classifies it, then routes work to CTO and CMO Agents.

The look adapts the warm paper, sketched editor controls, timeline, and orange square mascot from the public Motion Face clip **claude_剪视频过程motion** by zdxpan. The source clip was used for visual analysis but is not included in this repository. No signed source URL or site credential is stored here. All scene graphics are authored in Remotion; there is no outside stock video, voice-over, or music.

## Run

```bash
npm ci
npm run studio
```

## Render

```bash
npm run render
```

The MP4 is written to `out/AgentDispatch.mp4`. Rendering uses the Chrome Headless Shell managed by Remotion; on a fresh machine, Remotion may need network access to obtain it.

## Preview stills

```bash
npm run stills
```

The still frames are saved in `out/`. The SRT cues are embedded as subtitles in the video; no audio track is present.
