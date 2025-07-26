

export function validateEmail(value) {
  const trimmed = value.trim();

  if (!trimmed) return "Email is required";

  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(trimmed)) return "Enter a valid email address";

  return null;
}

export function validatePhone(value) {
  const trimmed = value.trim();

  if (!trimmed) return "Contact number is required";
  const digitsOnly = trimmed.replace(/\D/g, '');

  
  if (digitsOnly.length < 10 || digitsOnly.length > 10) {
    return "Enter a valid contact number (10)";
  }

  if (digitsOnly.length === 10) {
    if (!/^[6-9]/.test(digitsOnly)) {
      return "Enter a valid Indian mobile number";
    }
  }

  if (digitsOnly.length > 10) {
    if (!/^[1-9]/.test(digitsOnly)) {
      return "Enter a valid contact number";
    }
  }

  return null;
}

export function validateName(value) {
  const trimmed = value.trim();

  if (!trimmed) return "Name is required";

  if (trimmed.length < 2) return "Name must be at least 2 characters";

  if (trimmed.length > 50) return "Name must be less than 50 characters";

  const nameRegex = /^[a-zA-Z\s\-'.]+$/;
  if (!nameRegex.test(trimmed)) {
    return "Name can only contain letters, spaces, hyphens, apostrophes, and dots";
  }

  if (/\s{2,}/.test(trimmed)) {
    return "Name cannot have consecutive spaces";
  }
  if (/^[\s\-'.]|[\s\-'.]$/.test(trimmed)) {
    return "Name cannot start or end with special characters";
  }

  return null;
}

export function teamValidateDescription(value) {
  const trimmed = value.trim();

  if (!trimmed || !/[A-Za-z]/.test(trimmed)) {
    return "Team description must contain at least one alphabet character and not be empty or whitespace only.";
  }

  return null;

  
}


export function validateTitle(value) {
  if (typeof value !== 'string') {
    return "Title must be a valid string";
  }

  const trimmed = value.trim();

  if (trimmed.length < 3) {
    return "Title must be at least 3 characters long";
  }

  const forbiddenCharsRegex = /[\/\-_]/;
  if (forbiddenCharsRegex.test(trimmed)) {
    return "Title contains invalid characters: /, -, _ are not allowed.";
  }

  return null;
}


export function validatePassword(value) {
  const trimmed = value.trim();

  if (trimmed.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  if (!passwordRegex.test(trimmed)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)";
  }

  return null; 
}

export function validateNotes(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Notes cannot be empty.";
  }

  const words = trimmed.split(/\s+/);
  if (words.length < 5) {
    return "Notes should be at least 5 words.";
  }

  const startsWithValidChar = /^[A-Za-z0-9]/.test(trimmed);
  if (!startsWithValidChar) {
    return "Notes must start with a letter or number.";
  }

  const onlySpecialChars = /^[^A-Za-z0-9]+$/.test(trimmed);
  if (onlySpecialChars) {
    return "Notes cannot consist of only special characters.";
  }

  return null; 
}

export function validateCustomFieldName(name) {
  const trimmed = name.trim();

  if (!trimmed) return "Field name cannot be empty.";
  if (/^[^a-zA-Z0-9]/.test(trimmed)) return "Field name cannot start with a special character.";
  if (/[^a-zA-Z0-9\s_-]/.test(trimmed)) return "Field name contains invalid characters.";
  if (trimmed.length < 3) return "Field name must be at least 3 characters.";
  if (/^\d+$/.test(trimmed)) {
    return "Field name cannot be only numbers.";
  }

  if (/[_-]$/.test(trimmed)) {
    return "Field name cannot end with an underscore or dash.";
  }
   if (/^([A-Za-z0-9\s_-])\1+$/.test(trimmed)) {
    return "Field name cannot be the same character repeated.";
  }

  return null; 
}
export function validateCustomFieldValue(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Field value cannot be empty.";
  }

  const allowedCharsRegex = /^[A-Za-z0-9\s.,@!#$%&*()_+\-="']+$/;
  if (!allowedCharsRegex.test(trimmed)) {
    return "Field value contains invalid characters.";
  }
  return null; 
}

