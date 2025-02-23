import { HOUR_TO_MINUTE } from './constant';
import { HmTime } from './type';

export function hmTimeToMinute(time: HmTime): number {
  return time.hours * HOUR_TO_MINUTE + time.minutes;
}

export function minuteToHmTime(minutes: number): HmTime {
  return {
    hours: Math.floor(minutes / HOUR_TO_MINUTE),
    minutes: minutes % HOUR_TO_MINUTE,
  };
}

export function convertHmTimeToText(hmTime: HmTime): string {
  return `${hmTime.hours.toString().padStart(2, '0')}h ${hmTime.minutes
    .toString()
    .padStart(2, '0')}m`;
}

export function genId() {
  let currentId: number = 0;
  return {
    set: (value: number) => (currentId = value),
    get: () => String(++currentId),
  };
}

export function requiredValidation<T>(val: T) {
  return val === 0 || !!val || 'Field is required';
}
