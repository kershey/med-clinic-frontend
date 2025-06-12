/**
 * Enumeration for user roles in the medical clinic system.
 */
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

/**
 * Enumeration for account status types in the authentication flow.
 */
export enum AccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  PENDING_ACTIVATION = 'PENDING_ACTIVATION', // For staff/admin accounts awaiting first login/setup
  DISABLED = 'DISABLED', // Account created but not yet approved/activated (e.g., doctor pending approval, self-reg admin pending approval)
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  RED_TAG = 'RED_TAG', // Account flagged for investigation
}

/**
 * Enumeration for doctor availability status.
 */
export enum DoctorStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  ON_LEAVE = 'ON_LEAVE',
  ON_CALL = 'ON_CALL',
}

/**
 * Interface for doctor-specific details.
 */
export interface DoctorSpecifics {
  specialization: string;
  availability_status: DoctorStatus; // Assuming it uses the DoctorStatus enum
  // Add any other doctor-specific fields here, e.g.:
  // years_of_experience?: number;
  // consultation_fee?: number;
  // office_location?: string;
}

/**
 * Interface representing a user in the system.
 * Mirrors the UserResponse schema from the backend.
 */
export interface User {
  id: number;
  email: string;
  full_name: string;
  gender?: string | null;
  address?: string | null;
  contact?: string | null;
  // is_active: boolean; // Deprecated in backend UserResponse, but was in User model. Confirm if needed.
  is_verified: boolean;
  role: UserRole;
  account_status: AccountStatus; // Corresponds to 'status' in backend User model, aliased as account_status in UserResponse
  profile_image?: string | null;
  created_by?: number | null; // ID of admin/staff who created this account
  created_at: string; // ISO date string
  updated_at?: string | null; // ISO date string
  doctor_specifics?: DoctorSpecifics | null; // Added doctor-specific details
}

/**
 * Interface for the user object often stored in auth context or localStorage.
 * Can be the same as User, or a subset/superset based on needs.
 */
export type AuthenticatedUser = User;
