export enum AccountType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum DocumentType {
  NATIONAL_ID = "NATIONAL_ID",
  DRIVERS_LICENSE = "DRIVERS_LICENSE",
  PASSPORT = "PASSPORT",
  VOTERS_CARD = "VOTERS_CARD",
  BUSINESS_REGISTRATION = "BUSINESS_REGISTRATION",
  UTILITY_BILL = "UTILITY_BILL",
  OTHER = "OTHER",
}

export interface VerificationDocument {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  submittedAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly verifiedAt: Date;
  rejectionReason?: string;
}

export enum EscrowStatus {
  NOT_FUNDED = "NOT_FUNDED",
  FUNDED = "FUNDED",
  RELEASED = "RELEASED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export interface Evidence {
  id: string;
  evidenceType: string;
  description: string;
  evidenceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeliveryMethod {
  IN_PERSON = "IN_PERSON",
  SHIPPING = "SHIPPING",
  COURIER = "COURIER",
  DIGITAL = "DIGITAL",
  OTHER = "OTHER",
}

export interface User {
  readonly id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  accountType: AccountType;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  address?: Address;
  verificationDocuments?: VerificationDocument[];
}

export interface GetUsersResponse {
  users: User[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type UsersFiltersInput = Partial<User>;

export interface PaginationInput {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: string;
}
export interface GetUsersInput {
  filters: UsersFiltersInput;
  pagination: PaginationInput;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalTransactions: number;
  activeDisputes: number;
  totalTransactionVolume: number;
}

export enum TransactionStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  DISPUTED = "DISPUTED",
  REFUND_REQUESTED = "REFUND_REQUESTED",
  REFUNDED = "REFUNDED",
}

export enum TransactionType {
  PHYSICAL = "PHYSICAL",
  SERVICE = "SERVICE",
  DIGITAL = "DIGITAL",
}

export interface TransactionLog {
  id: string;
  transactionId: string;
  action: string;
  status: TransactionStatus;
  escrowStatus: EscrowStatus;
  performedBy: string;
  description: string;
  createdAt: Date;
  transaction: Transaction;
}

export interface StatusBreakdown {
  count: number;
  status: TransactionStatus;
}

export interface TransactionReport {
  totalTransactions: number;
  totalAmount: number;
  totalEscrowFees: number;
  completedTransactions: number;
  canceledTransactions: number;
  disputedTransactions: number;
  averageTransactionAmount: number;
  statusBreakdown: StatusBreakdown;
}

export interface ReportDateRangeInput {
  endDate: Date;
  startDate: Date;
}

export interface Transaction {
  id: string;
  transactionCode: string;
  sellerId: string;
  buyerId: string;
  title: string;
  description: string;
  amount: number;
  escrowFee: number;
  totalAmount: number;
  paymentCurrency: PaymentCurrency;
  paymentReference?: string;
  status: TransactionStatus;
  escrowStatus: EscrowStatus;
  deliveryMethod?: DeliveryMethod;
  trackingInfo?: string;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  isPaid: boolean;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  canceledAt?: Date;
  refundedAt?: Date;
  payment: Payment;
  buyer: Partial<User>;
  seller: Partial<User>;
  logs: TransactionLog[];
}

export interface DisputeReport {
  totalDisputes: number;
  resolvedDisputes: number;
  pendingDisputes: number;
  averageResolutionTime: number;
  disputeRate: number;
}

export interface TransactionFilterInput {
  page: number;
  limit: number;
  status: string;
  escrowStatus: string;
  startDate: Date;
  endDate: Date;
}

export interface ReleaseEscrowInput {
  transactionId: string;
}

export enum DisputeStatus {
  OPENED = "OPENED",
  IN_REVIEW = "IN_REVIEW",
  RESOLVED_FOR_BUYER = "RESOLVED_FOR_BUYER",
  RESOLVED_FOR_SELLER = "RESOLVED_FOR_SELLER",
  RESOLVED_COMPROMISE = "RESOLVED_COMPROMISE",
  CLOSED = "CLOSED",
}

export interface DisputeManagementInput {
  disputeId: string;
  resolution: string;
  status: DisputeStatus;
}

export interface Evidence {
  id: string;
  evidenceType: string;
  description: string;
  evidenceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserManagementInput {
  accountType: AccountType;
  userId: string;
  verified: boolean;
}

export interface ReviewVerificationDocumentInput {
  documentId: string;
  rejectionReason: string;
  status: VerificationStatus;
}

export interface SystemConfigInput {
  description: string;
  key: string;
  value: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  escrowBalance: number;
  currency: PaymentCurrency;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  transactions: WalletTransaction[];
}

export enum WalletTransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  ESCROW_FUNDING = "ESCROW_FUNDING",
  ESCROW_RELEASE = "ESCROW_RELEASE",
  ESCROW_REFUND = "ESCROW_REFUND",
  FEE_PAYMENT = "FEE_PAYMENT",
  BONUS = "BONUS",
}

export enum WalletTransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  currency: PaymentCurrency;
  description: string;
  type: WalletTransactionType;
  reference: string;
  balanceBefore: number;
  balanceAfter: number;
  status: WalletTransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  wallet: Wallet;
}

export enum PaymentCurrency {
  NGN = "NGN",
}

export enum PaymentGateway {
  PAYSTACK = "PAYSTACK",
  FLUTTERWAVE = "FLUTTERWAVE",
  WALLET = "WALLET",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export interface Payment {
  readonly id: string;
  amount: number;
  fee: number;
  totalAmount: number;
  paymentCurrency: PaymentCurrency;
  paymentGateway: PaymentGateway;
  gatewayReference: string;
  gatewayResponse?: {
    redirectUrl: string;
  };
  status: PaymentStatus;
  readonly createdAt: Date;
  updatedAt: Date;
  transaction?: Transaction[];
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuditLog {
  id: string;
  userId: string;
  entityType: string;
  action: string;
  category: string;
  details: string;
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  documentType: DocumentType;
  documentNumber: string;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  submittedAt: Date;
}

export interface ReviewVerificationDocumentInput {
  documentId: string;
  status: VerificationStatus;
  rejectionReason: string;
}
