// Haptic Feedback Utility
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

export function triggerHaptic(pattern: HapticPattern) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return; // Haptics not supported
  }

  const patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: [30, 50, 30],
    success: [15, 30, 15],
    error: [20, 50, 20],
    warning: [25, 40],
  };

  navigator.vibrate(patterns[pattern]);
}

export function triggerClickHaptic() {
  triggerHaptic('light');
}

export function triggerSuccessHaptic() {
  triggerHaptic('success');
}

export function triggerErrorHaptic() {
  triggerHaptic('error');
}

export function triggerPurchaseHaptic() {
  triggerHaptic('medium');
}

export function triggerTravelHaptic() {
  triggerHaptic('heavy');
}
