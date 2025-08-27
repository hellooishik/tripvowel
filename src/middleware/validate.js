export default (schema) => (req, res, next) => {
  // Compose shape that our Joi schemas expect, e.g. Joi.object({ body: Joi.object({...}) })
  const toValidate = {
    body: req.body,
    query: req.query,
    params: req.params,
  };

  const { error } = schema.validate(toValidate, { abortEarly: false, allowUnknown: true });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((d) => ({ message: d.message, path: d.path })),
    });
  }

  next();
};