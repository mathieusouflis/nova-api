exports.validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*\d)(?=.*[~!@#$%\^&*()_\-+=|\\{}[\]:;<>?\/.,""])(?=.*[A-Z])(?=.*[a-z])\S{9,}$/;
  return passwordRegex.test(password)
    ? [true]
    : [
        false,
        "Le mot de passe doit au moins contenir : Un chiffre, un caractère spécial, un lettre majuscule, une lettre minuscule, Au moins 9 caractères, uniquement des caractères visibles(pas d'espaces).",
      ];
};
