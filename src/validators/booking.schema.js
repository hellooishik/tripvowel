import Joi from "joi";

export const createBookingSchema = Joi.object({
  body: Joi.object({
    tripId: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    quantity: Joi.number().min(1).default(1)
  })
});
