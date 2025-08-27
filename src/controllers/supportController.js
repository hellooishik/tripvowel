import asyncHandler from "../utils/asyncHandler.js";
import SupportTicket from "../models/SupportTicket.js";

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.create({ user: req.user._id, ...req.body });
  res.status(201).json(ticket);
});

export const myTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id });
  res.json(tickets);
});

export const listAllTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find().populate("user", "name email");
  res.json(tickets);
});

export const replyTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  ticket.replies.push({ by: req.user.role === "admin" ? "admin" : "user", message: req.body.message });
  await ticket.save();
  res.json(ticket);
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  res.json(ticket);
});
