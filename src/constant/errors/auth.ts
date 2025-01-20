export const auth = {
  TOKEN_EXPIRED: {
    errorMessage: 'You login session has expired',
    PacificCode: 'Pacific_01003'
  },
  INVALID_TOKEN: {
    errorMessage: 'Invalid Login Token. Please login again',
    PacificCode: 'Pacific_01004'
  },
  AUTHORIZATION_ERROR: {
    errorMessage: "You don't have access to this section. Please reach out to your system administrator to get the access.",
    PacificCode: 'Pacific_01005'
  },
  SESSION_EXPIRE_TIME:{
    errorMessage: "Your session has been expired. Please log in again.",
    PacificCode: 'Pacific_01006'
  },
  SESSION_FORCE_LOGOUT:{
    errorMessage: "Your role has been updated. Please log in again.",
    PacificCode: 'Pacific_01007'
  },
  TOKEN_NOT_PROVIDED:{
    errorMessage: "Token is not provided ",
    PacificCode: null

  }
};
