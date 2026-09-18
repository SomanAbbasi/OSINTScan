export function validateUsername(input: string): { isValid: boolean; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, error: "Please enter a username or handle to scan." };
  }
  if (trimmed.length > 64) {
    return { isValid: false, error: "Username must be 64 characters or fewer." };
  }
  // Allow letters, numbers, dot, underscore, hyphen
  const validRegex = /^[a-zA-Z0-9_\-\.]+$/;
  if (!validRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Username contains invalid characters. Use letters, numbers, '.', '_', or '-'.",
    };
  }
  return { isValid: true };
}
