module.exports = {
  DEFAULT_SORT_FIELD: 'createdAt',
  DEFAULT_SORT: 'DESC',
  DEFAULT_PAGE_NO: 1,
  INACTIVE: 'Inactive',
  ACTIVE: 'Active',
  DEFAULT_PAGE_LIMIT: 10,
  TRUE: 'true',
  FALSE: 'false',
  MIN_MAX_NAME_LENGTH: [3, 32],
  MIN_MAX_PINCODE_LENGTH: [4, 6],
  status: {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    CONFLICT: 409,
    INVALID_TOKEN: 498,
    SERVER_ERROR: 500,
    STATUS_DELETE: 2,
    STATUS_ACTIVE: 1,
    STATUS_INACTIVE: 0,
    PWD_ENCRYPTION_ITERATION: 10,
    ENCRYPTION_ALGORITHM: 'aes-256-cbc'
  },
  messages: {
    USER_CREATED: 'User created successfully',
    PASSWORD_UPDATED: 'Password updated successfully',
    SECURE_CODE_DELETED: 'Secure code deleted successfully',
    USER_ACTIVATION_EMAIL_SENT: 'User activation email sent successfully',
    SUCCESSFUL_AUTHENTICATION: 'User authenticated successfully',
    PASSWORD_RESET_LINK_SENT: 'Password reset link sent successfully',
    // Role related messages
    SUCCESSFUL_ROLE_CREATED: 'Role created successfully',
    SUCCESSFUL_ROLE_DELETED: 'Role deleted successfully',
    // Classroom related messages
    CLASSROOM_CREATED: 'Classroom created successfully',
    CLASSROOM_DELETED: 'Classroom deleted successfully',
    CLASSROOM_UPDATED: 'Classroom updated successfully',
    // Location related success message
    LOCATION_CREATED: 'Location created successfully',
    LOCATION_DELETED: 'Location deleted successfully',
    LOCATION_UPDATED: 'Location updated successfully',
    // Accessories related messages
    ACCESSORY_CREATED: 'Accessory created successfully',
    ACCESSORY_UPDATED: 'Accessory updated successfully',
    ACCESSORY_DELETED: 'Accessory deleted successfully',
    // Status related messages
    STATUS_CREATED: 'Status created successfully',
    // Corporate related messages
    CORPORATE_CREATED: 'Corporate created successfully',
    CORPORATE_UPDATED: 'Corporate updated successfully',
    CORPORATE_DELETED: 'Corporate deleted successfully'
  }
};
