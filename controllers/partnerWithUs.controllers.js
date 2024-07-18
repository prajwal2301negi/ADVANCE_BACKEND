import PartnerUs from "../models/partnerWithUs.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";

export const partnerUsPost = asyncErrorHandler(async (req, res, next) => {
  const { nameOfCompany, email, phone, whyYouWantToCollab } = req.body;
  if (!nameOfCompany || !email || !phone || !whyYouWantToCollab) {
    return next(new ErrorHandler("Fill the credentials to collab with us"));
  }
  const newpartnerUs = await PartnerUs.create({
    nameOfCompany,
    email,
    phone,
    whyYouWantToCollab,
  });
  res.status(201).json({
    success: true,
    message: "Your request has been sent successfully",
    newpartnerUs,
  });
});

export const getAllPartnershipRequests = asyncErrorHandler(
  async (req, res, next) => {
    const requests = await PartnerUs.find();
    if (!requests) {
      return next(new ErrorHandler("No partnership requests found", 404));
    }
    res.status(200).json({
      success: true,
      requests,
    });
  }
);
