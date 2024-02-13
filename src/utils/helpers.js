import en from "./i18n";

export function validateEmail(email) {
  if (!email) {
    return en.ERRORS.EMPTY_EMAIL;
  }
  //Check email regex
  const emailRegex = /^\w+([.-]?\w+)*@(grenoble-inp\.org|grenoble-inp\.fr)$/;
  if (!emailRegex.test(email)) {
    return en.ERRORS.INVALID_EMAIL;
  }
  validateEmailDomain(email);
}

export function validateEmailDomain(email) {
  if (!email) {
    return en.ERRORS.EMPTY_EMAIL;
  }

  const domain = email.split('@')[1];
  if (domain.endsWith('grenoble-inp.org')) {
    return 'Le domaine de l\'e-mail est grenoble-inp.org';
  } else if (domain.endsWith('grenoble-inp.fr')) {
    return 'Le domaine de l\'e-mail est grenoble-inp.fr';
  } else {
    return 'Le domaine de l\'e-mail n\'est pas valide pour Grenoble INP';
  }
}

export function validatePassword(password) {
  if (!password) {
    return en.ERRORS.EMPTY_PASSWORD;
  }
}

export function validateEmailPassword(email, password) {
  const msg = validateEmail(email);

  if (msg) {
    return msg;
  }

  return validatePassword(password);
}
