import axios from 'axios';
import { toErrorText } from './errorText';

type ApiErrorPayload = {
  message?: unknown;
  details?: unknown;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const payload =
      error.response?.data && typeof error.response.data === 'object'
        ? (error.response.data as ApiErrorPayload)
        : undefined;

    return (
      toErrorText(payload?.details) ||
      toErrorText(payload?.message) ||
      toErrorText(error.message) ||
      fallback
    );
  }

  return toErrorText(error) || fallback;
}
