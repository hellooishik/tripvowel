import Joi from "joi";

export const createTicketSchema = Joi.object({
  body: Joi.object({
    subject: Joi.string().min(3).required(),
    message: Joi.string().min(5).required()
  })
});

export const replyTicketSchema = Joi.object({
  body: Joi.object({
    message: Joi.string().min(1).required()
  })
});
