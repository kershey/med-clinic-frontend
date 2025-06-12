import apiClient from '../lib/apiClient';
import {
  PatientRegistrationPayload,
  DoctorRegistrationPayload,
  AdminRegistrationPayload,
  StaffRegistrationByAdminPayload,
  LoginPayload,
  LoginResponse,
  VerifyEmailPayload,
  ResendVerificationPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordInternalPayload,
  StaffFirstLoginPasswordSetPayload,
  BootstrapStatusResponse,
  ActivationTokenStatusResponse,
  DoctorOnHireUpdatePayload,
  ApiMessageResponse,
  AuditLogResponse, // This is actually List<AuditLog> from backend
  OAuth2TokenResponse,
} from '../types/auth.types';
import { User, UserRole, DoctorStatus } from '../types/user.types';

const AUTH_BASE_URL = '/auth'; // apiClient already has /api/v1 prefix

/**
 * Registers a new patient.
 */
export const registerPatient = async (
  payload: PatientRegistrationPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/register/patient`,
    payload
  );
  return response.data;
};

/**
 * Registers a new doctor (pending admin approval).
 */
export const registerDoctor = async (
  payload: DoctorRegistrationPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/register/doctor`,
    payload
  );
  return response.data;
};

/**
 * Admin self-registration (pending approval by another admin).
 */
export const registerAdminSelf = async (
  payload: AdminRegistrationPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/register/admin`,
    payload
  );
  return response.data;
};

/**
 * Logs in a user.
 */
export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    `${AUTH_BASE_URL}/login`,
    payload
  );
  if (response.data.access_token && response.data.user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

/**
 * Verifies a user's email address.
 */
export const verifyEmail = async (
  payload: VerifyEmailPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/verify-email`,
    payload
  );
  return response.data;
};

/**
 * Resends the verification email.
 */
export const resendVerificationEmail = async (
  payload: ResendVerificationPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/resend-verification`,
    payload
  );
  return response.data;
};

/**
 * Initiates the forgot password process.
 */
export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/forgot-password`,
    payload
  );
  return response.data;
};

/**
 * Resets the user's password using a reset token.
 */
export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/reset-password`,
    payload
  );
  return response.data;
};

/**
 * Allows an authenticated user to change their own password.
 */
export const changePasswordInternal = async (
  payload: ChangePasswordInternalPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.put<ApiMessageResponse>(
    `${AUTH_BASE_URL}/change-password`,
    payload
  );
  return response.data;
};

/**
 * Refreshes the access token using a refresh token.
 * Assumes refresh token is handled by apiClient interceptor or sent in header.
 */
export const refreshToken = async (): Promise<LoginResponse> => {
  // The actual refresh token should be sent securely, often in an HttpOnly cookie
  // or passed to this function if not handled by an interceptor. Our interceptor adds access token.
  // For this client, we assume the backend /refresh endpoint uses the existing (potentially expired)
  // access token to identify the user and verify the refresh token from httpOnly cookie or a custom header.
  // If refresh token needs to be sent in body, this needs adjustment.
  // Our current backend setup for /refresh expects a valid (or recently expired) JWT for current_user dependency.
  const response = await apiClient.post<LoginResponse>(
    `${AUTH_BASE_URL}/refresh`
  );
  if (response.data.access_token && response.data.user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.access_token);
      // Potentially update refreshToken if backend sends a new one
      if (response.data.refresh_token) {
        localStorage.setItem('refreshToken', response.data.refresh_token);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

/**
 * Logs out the user (client-side token removal).
 */
export const logoutUser = async (): Promise<ApiMessageResponse> => {
  // Call the backend logout endpoint for audit logging and any server-side session cleanup if applicable
  try {
    await apiClient.post<ApiMessageResponse>(`${AUTH_BASE_URL}/logout`);
  } catch (error) {
    console.warn(
      'Backend logout call failed, proceeding with client-side logout:',
      error
    );
    // Even if backend call fails, ensure client-side logout occurs
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
  // Return a success message or the response from backend if it was successful
  return { message: 'Successfully logged out' };
};

/**
 * Fetches the current authenticated user's profile.
 */
export const getCurrentUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>(`${AUTH_BASE_URL}/me`);
  return response.data;
};

/**
 * Checks the bootstrap admin status.
 */
export const getBootstrapStatus =
  async (): Promise<BootstrapStatusResponse> => {
    const response = await apiClient.get<BootstrapStatusResponse>(
      `${AUTH_BASE_URL}/bootstrap-status`
    );
    return response.data;
  };

/**
 * Staff first login: set password and activate account.
 * Requires the staff member to be authenticated (e.g. with temporary credentials or a one-time token).
 */
export const staffActivateAccount = async (
  payload: StaffFirstLoginPasswordSetPayload
): Promise<User> => {
  const response = await apiClient.post<User>(
    `${AUTH_BASE_URL}/activate-account`,
    payload
  );
  // If activation results in a new session/token, handle it here if needed
  // For now, assume current token is still valid or login is required after.
  return response.data;
};

/**
 * Checks the status of a generic activation token.
 */
export const checkActivationTokenStatus = async (
  token: string
): Promise<ActivationTokenStatusResponse> => {
  const response = await apiClient.get<ActivationTokenStatusResponse>(
    `${AUTH_BASE_URL}/activation-status/${token}`
  );
  return response.data;
};

// --- Admin Specific Services ---

/**
 * Admin creates a new staff account.
 */
export const adminCreateStaff = async (
  payload: StaffRegistrationByAdminPayload
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_URL}/admin/create-staff`,
    payload
  );
  return response.data;
};

/**
 * Admin activates a user account (e.g., a doctor or a self-registered admin).
 */
export const adminActivateUser = async (
  userIdToActivate: number
): Promise<User> => {
  const response = await apiClient.put<User>(
    `${AUTH_BASE_URL}/admin/activate/${userIdToActivate}`
  );
  return response.data;
};

/**
 * Admin deactivates a user account.
 */
export const adminDeactivateUser = async (
  userIdToDeactivate: number
): Promise<User> => {
  const response = await apiClient.put<User>(
    `${AUTH_BASE_URL}/admin/deactivate/${userIdToDeactivate}`
  );
  return response.data;
};

/**
 * Admin sets a doctor's on-hire (availability) status.
 */
export const adminSetDoctorOnHireStatus = async (
  doctorUserId: number,
  payload: DoctorOnHireUpdatePayload
): Promise<User> => {
  // Backend returns UserResponse for the doctor
  const response = await apiClient.put<User>(
    `${AUTH_BASE_URL}/admin/doctor/onhire/${doctorUserId}`,
    payload
  );
  return response.data;
};

/**
 * Admin retrieves audit logs.
 */
export const adminGetAuditLogs = async (params?: {
  user_id_filter?: number;
  limit?: number;
  offset?: number;
}): Promise<AuditLogResponse> => {
  const response = await apiClient.get<AuditLogResponse>(
    `${AUTH_BASE_URL}/admin/audit-logs`,
    { params }
  );
  return response.data;
};

/**
 * (Optional) Bootstrap admin if not using environment variables directly on backend startup.
 * The backend /bootstrap-admin is a POST that reads from ENV.
 * If frontend needs to trigger this with form data, a different backend endpoint would be needed.
 * For now, assuming bootstrap is an ENV-driven backend process or a one-time direct API call post-deployment.
 */

/**
 * (Optional) Get OAuth2 token if a different flow than /login is needed.
 */
export const getOAuth2Token = async (
  formData: URLSearchParams
): Promise<OAuth2TokenResponse> => {
  // OAuth2 typically uses 'application/x-www-form-urlencoded'
  const response = await apiClient.post<OAuth2TokenResponse>(
    `${AUTH_BASE_URL}/oauth2-token`,
    formData,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  // Handle token storage if this flow is used
  return response.data;
};
