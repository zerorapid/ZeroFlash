// ============================================================
// Zap Actions — 8 executable app actions Zap can trigger
// ============================================================

export type ZapActionId =
  | 'OPEN_LOGO_UPLOADER'
  | 'FIX_WCAG_CONTRAST'
  | 'SHOW_QUICK_MODE'
  | 'OPEN_EXPORT'
  | 'AUTO_FILL_SLIDE'
  | 'AUTO_FIT_MOCKUP'
  | 'TRIM_OPTIONAL_SLIDES'
  | 'GENERATE_PALETTE';

export interface ZapActionHandlers {
  OPEN_LOGO_UPLOADER?: () => void;
  FIX_WCAG_CONTRAST?: () => void;
  SHOW_QUICK_MODE?: () => void;
  OPEN_EXPORT?: () => void;
  AUTO_FILL_SLIDE?: () => void;
  AUTO_FIT_MOCKUP?: () => void;
  TRIM_OPTIONAL_SLIDES?: () => void;
  GENERATE_PALETTE?: () => void;
}

export function executeAppAction(
  actionId: ZapActionId,
  handlers: ZapActionHandlers
): void {
  const handler = handlers[actionId];
  if (handler) {
    handler();
  } else {
    console.warn(`[Zap] No handler registered for action: ${actionId}`);
  }
}
