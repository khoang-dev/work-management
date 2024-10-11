export const MINUTE_TO_SECOND = 60;
export const HOUR_TO_MINUTE = 60;

export enum Modes {
  FOCUS = 'Focus',
  SHORT_BREAK = 'Short break',
  LONG_BREAK = 'Long break',
}
export const MESSAGE_MODES = {
  [Modes.FOCUS]: "Time's up! Take a break.",
  [Modes.SHORT_BREAK]: 'Short break is over. Back to work!',
  [Modes.LONG_BREAK]: 'Long break is over. Ready to focus again?',
};
