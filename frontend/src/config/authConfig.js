// src/config/authConfig.js
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || 'TU_CLIENT_ID',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID || 'TU_TENANT_ID'}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
}

export const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || '/api'
export const n8nChatUrl = import.meta.env.VITE_N8N_CHAT_URL || 'http://localhost:5678/webhook/chat'