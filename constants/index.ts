export const API_URL = "https://tanscrow.onrender.com/graphql";

export const TRANSACTION_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
  DISPUTED: "bg-orange-100 text-orange-800",
  REFUND_REQUESTED: "bg-purple-100 text-purple-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export const ESCROW_STATUS_COLORS = {
  NOT_FUNDED: "bg-gray-100 text-gray-800",
  FUNDED: "bg-blue-100 text-blue-800",
  RELEASED: "bg-green-100 text-green-800",
  REFUNDED: "bg-red-100 text-red-800",
  PARTIALLY_REFUNDED: "bg-orange-100 text-orange-800",
};

export const DISPUTE_STATUS_COLORS = {
  OPENED: "bg-red-100 text-red-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  RESOLVED_FOR_BUYER: "bg-green-100 text-green-800",
  RESOLVED_FOR_SELLER: "bg-green-100 text-green-800",
  RESOLVED_COMPROMISE: "bg-blue-100 text-blue-800",
  CLOSED: "bg-gray-100 text-gray-800",
};
