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

// Fonction pour formater l'horodatage du post
// helpers.js

// Fonction pour formater l'horodatage du post
// helpers.js

// Fonction pour formater l'horodatage du post
export function formatPostTimestamp(timestamp) {
  const currentDate = new Date();
  const diffMilliseconds = currentDate - new Date(timestamp);
  const diffMinutes = Math.floor(diffMilliseconds / 60000);

  if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} minutes`;
  } else if (diffMinutes < 1440) {
    return `Il y a ${Math.floor(diffMinutes / 60)} heures`;
  } else if (diffMinutes < 10080) {
    return `Il y a ${Math.floor(diffMinutes / 1440)} jours`;
  } else {
    const options = { day: "numeric", month: "long", hour: "numeric", hour12: false, minute: "numeric" };
    const formattedDate = new Date(timestamp).toLocaleDateString("fr-FR", options);
    return formattedDate;
  }
}

export const compressImage = (img) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target.result;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = 1024;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], img.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', 0.9);
      };

      image.onerror = (error) => {
        reject(error);
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(img);
  });
}

export const cropImage = (img) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target.result;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const size = 170;

        canvas.width = size;
        canvas.height = size;

        let offsetX = 0;
        let offsetY = 0;

        if (image.width > image.height) {
          offsetX = (image.width - image.height) / 2;
        } else {
          offsetY = (image.height - image.width) / 2;
        }

        ctx.drawImage(image, offsetX, offsetY, image.width - 2 * offsetX, image.height - 2 * offsetY, 0, 0, size, size);

        canvas.toBlob((blob) => {
          const croppedFile = new File([blob], img.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(croppedFile);
        }, 'image/jpeg', 0.9);
      };

      image.onerror = (error) => {
        reject(error);
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(img);
  });
};