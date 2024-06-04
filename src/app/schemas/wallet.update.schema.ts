import Joi from "joi";

const frAlphaNum = /^[a-zA-ZÀ-ÿ0-9-]+$/;

export default Joi.object({
  name: Joi.string()
    .pattern(frAlphaNum)
    .error(
      new Error(
        "Le nom doit comporter uniquement des lettres, des chiffres et des tirets"
      )
    ),
  number: Joi.number()
    .integer()
    .min(1)
    .error(new Error("Le nombre doit être un nombre entier supérieur à 0")),
})
  .min(1)
  .required();
