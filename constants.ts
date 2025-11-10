export const DISPUTE_STATUS_COLORS: Record<string, string> = {
  OPENED: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  IN_REVIEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  RESOLVED_FOR_BUYER: "bg-green-500/10 text-green-500 border-green-500/20",
  RESOLVED_FOR_SELLER: "bg-green-500/10 text-green-500 border-green-500/20",
  RESOLVED_COMPROMISE: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  CLOSED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
  DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
  CANCELED: "bg-red-500/10 text-red-500 border-red-500/20",
  DISPUTED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  REFUND_REQUESTED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  REFUNDED: "bg-green-500/10 text-green-500 border-green-500/20",
};

export const ESCROW_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
  CANCELED: "bg-red-500/10 text-red-500 border-red-500/20",
  DISPUTED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  REFUND_REQUESTED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  REFUNDED: "bg-green-500/10 text-green-500 border-green-500/20",
};

// export const API_URL = "https://tanscrow.onrender.com/graphql";
export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/graphql"
    : process.env.NEXT_PUBLIC_API_URL;
