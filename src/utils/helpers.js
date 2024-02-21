import en from "./i18n";

export function validateEmail(email,login) {
  if (!email) {
    return en.ERRORS.EMPTY_EMAIL;
  }
  //Check email regex
  const emailRegex = /^\w+([.-]?\w+)*@(grenoble-inp\.org|grenoble-inp\.fr)$/;
  if (!emailRegex.test(email) && !login) {
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

export function validatePassword(password,login) {
  if (!password) {
    return en.ERRORS.EMPTY_PASSWORD;
  }

  if (login) {
    return;
  }

  //teste la longueur du mot de passe
  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }

  //teste la présence d'une minuscule
  if (!/[a-z]/.test(password)) {
    return 'Le mot de passe doit contenir au moins une lettre minuscule';
  }

  //teste la présence d'une majuscule
  if (!/[A-Z]/.test(password)) {
    return 'Le mot de passe doit contenir au moins une lettre majuscule';
  }

  //teste la présence d'un caractère spécial
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Le mot de passe doit contenir au moins un caractère spécial';
  }
}

export function validateEmailPassword(email, password, login) {
  const msg = validateEmail(email,login);

  if (msg) {
    return msg;
  }

  return validatePassword(password,login);
}
