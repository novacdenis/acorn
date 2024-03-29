export function getApiErrorMessage(
  error: unknown,
  message = "Something went wrong. Please try again later."
) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return message;
}
