import Joi from "joi";

const frAlphaNum = /^[a-zA-ZÀ-ÿ0-9-]+$/;

export default Joi.object({
  name: Joi.string()
    .pattern(frAlphaNum)
    .error(
      new Error(
        "Le nom est requis et doit comporter uniquement des lettres, des chiffres et des tirets"
      )
    ),
  number: Joi.number()
    .integer()
    .min(1)
    .error(
      new Error("Le nombre est requis et doit être un entier supérieur à 0")
    ),
}).required();
