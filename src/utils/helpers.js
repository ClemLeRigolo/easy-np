import en from "./i18n";
import DOMPurify from "dompurify";
import { isUserInGroup, isGroupPrivate, isUserSubscribed, getUserDataById } from "./firebase";

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
    return 'Le mot de passe doit contenir au moins 8 caractères';
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

  // if (msg) {
  //   return msg;
  // }

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

  if (diffMinutes < 1) {
    return "À l'instant";
  } else if (diffMinutes < 60) {
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

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement('canvas');
        const scaleFactor = Math.min(1, 1024 / img.width);
        elem.width = img.width * scaleFactor;
        elem.height = img.height * scaleFactor;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, elem.width, elem.height);
        ctx.canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, file.type, 1);
      };
      reader.onerror = error => reject(error);
    };
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

export const containsHtml = (content) => {
  const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
  return sanitizedContent !== content;
};

export const replaceLinksAndTags = (content) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const contentWithLineBreaks = content.replace(/\n/g, "<br>");

  const contentWithLinks = contentWithLineBreaks.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });

  return contentWithLinks;
};

export const reverseLinksAndTags = (content) => {
  if (!content) {
    return content;
  }
  const urlRegex = /<a href="(https?:\/\/[^\s]+)" target="_blank">[^<]+<\/a>/g;

  const contentWithoutLinks = content.replace(urlRegex, (match, url) => {
    return url;
  });

  //replace br tags with new line
  const contentWithoutLineBreaks = contentWithoutLinks.replace(/<br>/g, "\n");

  return contentWithoutLineBreaks;
}

export async function filterpost(posts,uid) {
  const userData = await getUserDataById(uid);
  const filteredPosts = await Promise.all(Object.values(posts).map(async (post) => {
    post = Object.values(post)[0];

    //console.log(post.groupId.toString().length)

    if (post.groupId > 9999999999999) {
      return false;
    }

    // Vérifier si l'utilisateur appartient au groupe du post
    const isInGroup = await isUserInGroup(post.groupId);
    const cantAccess = await isGroupPrivate(post.groupId, userData.school);

    //console.log(isInGroup, cantAccess)

    if (!isInGroup && cantAccess) {
      return false;
    }

    // Vérifier si l'utilisateur est abonné à l'auteur du post
    const isSubscribed = isUserSubscribed(uid, post.authorId);

    // Calculer les points du post en fonction des critères
    let points = 0;

    // Donner des points supplémentaires aux posts récents
    const postTimestamp = post.timestamp; // Modifier avec la propriété appropriée du post
    const currentTimestamp = Date.now(); // Modifier avec le timestamp actuel
    const timeDifference = currentTimestamp - postTimestamp;
    const MAX_TIME_DIFFERENCE = 24 * 60 * 60 * 1000; // Limite de 24 heures
    const TIME_POINTS_SCALE = 10; // Échelle pour les points de temps

    if (true || timeDifference <= MAX_TIME_DIFFERENCE) {
      const timePoints = Math.round((1 - timeDifference / MAX_TIME_DIFFERENCE) * TIME_POINTS_SCALE);
      points += timePoints;
      //console.log(timePoints)
    }

    // Donner des points supplémentaires aux posts des personnes auxquelles l'utilisateur est abonné
    if (isSubscribed) {
      points += 5; // Modifier le nombre de points selon votre préférence
    }

    // Donner des points supplémentaires aux posts des groupes auxquels l'utilisateur appartient
    if (isInGroup) {
      points += 3; // Modifier le nombre de points selon votre préférence
    }

    // Donner des points supplémentaires en fonction du nombre de likes et de commentaires
    let numLikes = 0; // Modifier avec la propriété appropriée du post
    let numComments = 0; // Modifier avec la propriété appropriée du post

    if (post.likes) {
      numLikes = post.likes.length || 0; // Modifier selon votre préférence
    }

    if (post.comments) {
      numComments = post.comments.length || 0; // Modifier selon votre préférence
    }

    points += numLikes + numComments; // Modifier selon votre préférence

    //console.log(post.content, points)

    post.points = points

    // Retourner true pour inclure le post, false pour l'exclure
    return post; // Modifier selon votre préférence pour définir le seuil de points
  }));

  return filteredPosts.filter(Boolean);
}

export function getEventStatus(startTime, endTime) {
  const now = new Date();

  const getDiffText = (diff) => {
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} jour(s)`;
    } else if (diffHours > 0) {
      return `${diffHours} heure(s)`;
    } else {
      return `${diffMinutes} minute(s)`;
    }
  };

  if (now < startTime) {
    const diff = startTime - now;
    return `L'évènement commence dans ${getDiffText(diff)}`;
  } else if (now < endTime) {
    const diff = endTime - now;
    return `L'évènement se termine dans ${getDiffText(diff)}`;
  } else {
    return "Évènement terminé";
  }
}