// One AudioContext for the whole site, shared by the soundtrack (music.ts)
// and the easter-egg sound effects (sfx.ts). Created lazily on first use,
// which is always after a user gesture, so browsers allow it to run.

let ctx: AudioContext | null = null;

export function audioCtx(): AudioContext {
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Browsers only let audio start after the visitor has clicked or pressed a
 *  key somewhere on the page; before that, don't even try. */
export const canPlayAudio = () => navigator.userActivation?.hasBeenActive ?? true;
