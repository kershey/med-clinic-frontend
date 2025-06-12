import { User, UserRole, AccountStatus, DoctorStatus } from './user.types';

// Base for User Creation (not directly used by frontend, but useful for understanding)
// export interface UserCreateBase {
//   email: string;
//   full_name: string;
// }

// Base for User Creation with Password (not directly used by frontend, but useful for understanding)
// export interface UserCreateWithPassword extends UserCreateBase {
//   password: string;
//   gender?: string | null;
//   address?: string | null;
//   contact?: string | null;
//   profile_image?: string | null;
// }

// Registration Payloads
export interface PatientRegistrationPayload {
  email: string;
  full_name: string;
  password: string;
  gender?: string | null;
  address?: string | null;
  contact?: string | null;
  profile_image?: string | null;
}

export interface DoctorRegistrationPayload {
  email: string;
  full_name: string;
  password: string;
  specialization: string;
  bio?: string | null;
  gender?: string | null;
  address?: string | null;
  contact?: string | null;
  profile_image?: string | null;
}

export interface AdminRegistrationPayload {
  email: string;
  full_name: string;
  password: string;
  admin_level?: number; // Default is 1 on backend
  justification: string;
  gender?: string | null;
  address?: string | null;
  contact?: string | null;
  profile_image?: string | null;
}

// Staff registration is done by an Admin, so the payload is slightly different on the frontend
// The admin provides these details. The password will be temporary, set by the backend.
export interface StaffRegistrationByAdminPayload {
  email: string;
  full_name: string;
  // Password is not sent from frontend for admin creating staff; backend generates temporary one
  gender?: string | null;
  address?: string | null;
  contact?: string | null;
  profile_image?: string | null;
  // department?: string; // These were commented out in backend StaffRegistration schema
  // employee_id?: string;
}

// Login
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string; // Added, assuming backend sends this from our service.py update
  token_type: string;
  user: User;
  permissions: string[]; // Or a more specific permission type
}

// Email Verification
export interface VerifyEmailPayload {
  email: string;
  verification_code: string;
}

export interface ResendVerificationPayload {
  email: string;
}

// Password Management
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  reset_token: string;
  new_password: string;
}

export interface ChangePasswordInternalPayload {
  current_password: string;
  new_password: string;
}

// Staff Account Activation (first login by staff)
export interface StaffFirstLoginPasswordSetPayload {
  new_password: string;
  confirm_password: string;
}

// Bootstrap & Activation Status
export interface BootstrapStatusResponse {
  bootstrap_admin_exists: boolean;
  message: string;
}

export interface ActivationTokenStatusResponse {
  is_valid: boolean;
  message: string;
  email?: string | null;
}

// Admin actions
export interface DoctorOnHireUpdatePayload {
  status: DoctorStatus;
}

// Audit Log
export interface AuditLog {
  id: number;
  user_id?: number | null;
  username?: string | null; // email or full_name from backend
  action: string;
  details?: Record<string, any> | null;
  ip_address?: string | null;
  timestamp: string; // ISO date string
}

export type AuditLogResponse = AuditLog[]; // Backend returns a List

// Generic API Success/Message Response (if needed for some endpoints)
export interface ApiMessageResponse {
  message: string;
  [key: string]: any; // For other potential properties
}

// For OAuth2 token response (if used directly, though /login is primary)
export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  role: UserRole;
}
