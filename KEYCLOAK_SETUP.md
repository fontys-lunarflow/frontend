# Keycloak Setup for User API Integration

This document outlines the Keycloak configuration required for the user-api to work properly in your Kubernetes cluster.

## Required Keycloak Configuration

### 1. Realm
- **Name**: `eclipse`
- **Enabled**: Yes

### 2. Client Configuration
- **Client ID**: `lunarflow`
- **Client authentication**: Enabled
- **Authorization**: Enabled
- **Standard Flow**: Enabled
- **Service Accounts Roles**: Enabled (critical for Admin API access)
- **Root URL**: Your LunarFlow application base URL
- **Home URL**: Your LunarFlow application base URL
- **Valid Redirect URIs**: `<your-app-url>/*`

### 3. Required Groups
Create the following groups in Keycloak:
- `LunarflowViewers` - Basic read access
- `LunarflowEditors` - Can edit content  
- `LunarflowAdmins` - Full administrative access

### 4. Service Account Permissions
For the `lunarflow` client, assign these service account roles:
- `view-users`
- `query-users`
- `view-realm`

### 5. Client Scopes - Group Mapper
Add a group membership mapper to include groups in tokens:
- **Name**: `groups`
- **Mapper Type**: `Group Membership`
- **Token Claim Name**: `groups`
- **Full group path**: OFF
- **Add to ID token**: ON
- **Add to access token**: ON
- **Add to userinfo**: ON

## Environment Variables

The user-api requires these environment variables:

```bash
QUARKUS_OIDC_AUTH_SERVER_URL=https://keycloak.luxdomain.work/realms/eclipse
QUARKUS_OIDC_CLIENT_ID=lunarflow
QUARKUS_OIDC_CREDENTIALS_SECRET=<your-client-secret>
```

## Keycloak Instance

Your Keycloak instance is available at: **https://keycloak.luxdomain.work/**

Make sure the `eclipse` realm is configured with the settings above.

## API Endpoints

Once configured, the user-api provides these endpoints:

- `GET /api/user/all` - Get all users
- `GET /api/user/id/{id}` - Get user by Keycloak ID
- `GET /api/user/username/{username}` - Get user by username
- `GET /api/user/group/{groupName}` - Get users by group

## Frontend Configuration

The frontend is configured to use:
- Development: `http://localhost:5002`
- Kubernetes: `http://user-api.lunarflow.svc.cluster.local:8080`

Environment detection is automatic based on `NODE_ENV` and `KUBERNETES_CLUSTER` variables. 