# API Routes Documentation

Complete list of all available API endpoints for Wryte AI.

**Base URL**: `http://localhost:3000/api/v1` (development)  
**Production**: `https://wryte-ai-api.onrender.com/api/v1`

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Organizations](#organizations)
- [Content Settings](#content-settings)
- [Webhooks](#webhooks)

---

## Authentication

All routes (except webhooks and health check) require authentication via Clerk.

**Authorization Header**:

```
Authorization: Bearer <clerk_jwt_token>
```

Clerk's frontend SDK automatically includes this token in requests when using the provided API client.

---

## Health Check

### `GET /health`

Check API and database health status.

**Authentication**: None required

**Response** (200 OK):

```json
{
  "status": "ok",
  "timestamp": "2025-12-17T10:30:00.000Z",
  "database": "ok"
}
```

**Response** (503 Service Unavailable - DB down):

```json
{
  "status": "degraded",
  "timestamp": "2025-12-17T10:30:00.000Z",
  "database": "down"
}
```

---

## Users

### `GET /api/v1/users/me`

Get the current authenticated user by their Clerk ID.

**Authentication**: Required

**Response** (200 OK):

```json
{
  "id": "clxyz123456789",
  "clerkId": "user_2a1b2c3d4e5f",
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-15T14:30:00.000Z"
}
```

---

### `GET /api/v1/users/:id`

Get a specific user by database ID.

**Authentication**: Required

**URL Parameters**:

- `id` - User's database ID (cuid)

**Response** (200 OK):

```json
{
  "id": "clxyz123456789",
  "clerkId": "user_2a1b2c3d4e5f",
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-15T14:30:00.000Z"
}
```

---

### `POST /api/v1/users`

Create a new user (typically handled by webhooks, but available if needed).

**Authentication**: Required

**Request Body**:

```json
{
  "clerkId": "user_2a1b2c3d4e5f",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Validation Rules**:

- `clerkId`: Required, string
- `email`: Required, valid email format
- `name`: Optional, string

**Response** (201 Created):

```json
{
  "id": "clxyz123456789",
  "clerkId": "user_2a1b2c3d4e5f",
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2025-12-17T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:00:00.000Z"
}
```

**Error** (409 Conflict):

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "User with this email already exists",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

---

### `PUT /api/v1/users/me`

Update the current user's information.

**Authentication**: Required

**Request Body**:

```json
{
  "email": "newemail@example.com",
  "name": "John Updated Doe"
}
```

**Validation Rules**:

- `email`: Optional, valid email format
- `name`: Optional, string

**Response** (200 OK):

```json
{
  "id": "clxyz123456789",
  "clerkId": "user_2a1b2c3d4e5f",
  "email": "newemail@example.com",
  "name": "John Updated Doe",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:05:00.000Z"
}
```

---

### `DELETE /api/v1/users/me`

Delete the current user account.

**Authentication**: Required

**Response** (200 OK):

```json
{
  "message": "User deleted successfully"
}
```

---

### `GET /api/v1/users/me/organizations`

Get all organizations the current user belongs to.

**Authentication**: Required

**Response** (200 OK):

```json
{
  "organizations": [
    {
      "id": "clorg123456789",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "role": "OWNER",
      "mission": "To make AI accessible to everyone",
      "description": "Leading AI solutions provider",
      "websiteUrl": "https://acme.com",
      "createdAt": "2025-12-01T10:00:00.000Z",
      "updatedAt": "2025-12-15T14:30:00.000Z"
    }
  ]
}
```

---

## Organizations

### `GET /api/v1/organizations`

Get all organizations for the authenticated user.

**Authentication**: Required

**Response** (200 OK):

```json
[
  {
    "id": "clorg123456789",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "mission": "To make AI accessible to everyone",
    "description": "Leading AI solutions provider",
    "websiteUrl": "https://acme.com",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-15T14:30:00.000Z",
    "members": [
      {
        "role": "OWNER"
      }
    ]
  }
]
```

---

### `POST /api/v1/organizations`

Create a new organization with optional content settings (onboarding wizard endpoint).

**Authentication**: Required

**Request Body** (Basic - without settings):

```json
{
  "name": "Prana Wellness",
  "mission": "Helping people live healthier lives through Ayurveda",
  "description": "We are a wellness company focused on holistic health",
  "websiteUrl": "https://www.pranawithlove.com"
}
```

**Request Body** (Complete - with content settings for onboarding):

```json
{
  "name": "Prana Wellness",
  "mission": "Helping people live healthier lives through Ayurveda",
  "description": "We are a wellness company focused on holistic health",
  "websiteUrl": "https://www.pranawithlove.com",
  "contentSettings": {
    "primaryKeywords": ["Ayurveda", "Wellness", "Holistic Health"],
    "secondaryKeywords": ["Meditation", "Yoga", "Natural Remedies"],
    "frequency": "WEEKLY",
    "planningPeriod": "QUARTERLY",
    "tone": "friendly",
    "targetAudience": "Women over 25 interested in wellness",
    "industry": "Health & Wellness",
    "goals": ["Brand awareness", "Lead generation"],
    "competitorUrls": ["https://www.deepakchopra.com/"],
    "topicsToAvoid": ["Politics", "Religion"],
    "preferredLength": "MEDIUM_FORM"
  }
}
```

**Validation Rules**:

- `name`: Required, 1-100 characters
- `mission`: Optional, max 1000 characters
- `description`: Optional, max 2000 characters
- `websiteUrl`: Optional, valid URL or empty string
- `contentSettings`: Optional object
  - `primaryKeywords`: Required if contentSettings provided, array 1-10 items
  - `secondaryKeywords`: Optional, array max 20 items
  - `frequency`: Optional, enum ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']
  - `planningPeriod`: Optional, enum ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']
  - `tone`: Optional, enum ['professional', 'casual', 'friendly', 'formal', 'witty', 'educational']
  - `targetAudience`: Optional, max 200 characters
  - `industry`: Optional, max 100 characters
  - `goals`: Optional, array max 10 items
  - `competitorUrls`: Optional, array of valid URLs, max 10 items
  - `topicsToAvoid`: Optional, array max 20 items
  - `preferredLength`: Optional, enum ['SHORT_FORM', 'MEDIUM_FORM', 'LONG_FORM']

**Response** (201 Created):

```json
{
  "id": "clorg987654321",
  "name": "Prana Wellness",
  "slug": "prana-wellness",
  "mission": "Helping people live healthier lives through Ayurveda",
  "description": "We are a wellness company focused on holistic health",
  "websiteUrl": "https://www.pranawithlove.com",
  "createdAt": "2025-12-17T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:00:00.000Z",
  "contentSettings": {
    "id": "clset123456789",
    "organizationId": "clorg987654321",
    "primaryKeywords": ["Ayurveda", "Wellness", "Holistic Health"],
    "secondaryKeywords": ["Meditation", "Yoga", "Natural Remedies"],
    "frequency": "WEEKLY",
    "planningPeriod": "QUARTERLY",
    "tone": "friendly",
    "targetAudience": "Women over 25 interested in wellness",
    "industry": "Health & Wellness",
    "goals": ["Brand awareness", "Lead generation"],
    "competitorUrls": ["https://www.deepakchopra.com/"],
    "topicsToAvoid": ["Politics", "Religion"],
    "preferredLength": "MEDIUM_FORM",
    "createdAt": "2025-12-17T10:00:00.000Z",
    "updatedAt": "2025-12-17T10:00:00.000Z"
  },
  "members": [
    {
      "role": "OWNER"
    }
  ]
}
```

**Error** (400 Bad Request - Validation):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Organization name is required"
      },
      {
        "field": "contentSettings.primaryKeywords",
        "message": "At least one primary keyword is required"
      }
    ],
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

**Note**: If the user doesn't exist in the database yet (first time creating an org), the user will be automatically created by fetching their details from Clerk.

---

### `GET /api/v1/organizations/:orgId`

Get a specific organization by ID.

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)

**Response** (200 OK):

```json
{
  "id": "clorg123456789",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "mission": "To make AI accessible to everyone",
  "description": "Leading AI solutions provider",
  "websiteUrl": "https://acme.com",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-15T14:30:00.000Z",
  "role": "OWNER",
  "contentSettings": {
    "id": "clset123456789",
    "organizationId": "clorg123456789",
    "primaryKeywords": ["AI", "SaaS", "Automation"],
    "secondaryKeywords": ["Machine Learning", "APIs"],
    "frequency": "WEEKLY",
    "planningPeriod": "QUARTERLY",
    "tone": "professional",
    "targetAudience": "B2B SaaS founders",
    "industry": "Technology",
    "goals": ["Lead generation", "Thought leadership"],
    "competitorUrls": ["https://competitor.com"],
    "topicsToAvoid": ["Pricing", "Internal processes"],
    "preferredLength": "LONG_FORM",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-15T14:30:00.000Z"
  }
}
```

**Error** (403 Forbidden):

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not a member of this organization",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

**Error** (404 Not Found):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Organization not found",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

---

### `GET /api/v1/organizations/slug/:slug`

Get a specific organization by slug (preferred for frontend URL routing).

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `slug` - Organization's URL slug (e.g., "acme-corp", "prana-wellness")

**Example Request**:

```
GET /api/v1/organizations/slug/prana-wellness
```

**Response** (200 OK):

```json
{
  "id": "clorg123456789",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "mission": "To make AI accessible to everyone",
  "description": "Leading AI solutions provider",
  "websiteUrl": "https://acme.com",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-15T14:30:00.000Z",
  "role": "OWNER",
  "contentSettings": {
    "id": "clset123456789",
    "organizationId": "clorg123456789",
    "primaryKeywords": ["AI", "SaaS", "Automation"],
    "secondaryKeywords": ["Machine Learning", "APIs"],
    "frequency": "WEEKLY",
    "planningPeriod": "QUARTERLY",
    "tone": "professional",
    "targetAudience": "B2B SaaS founders",
    "industry": "Technology",
    "goals": ["Lead generation", "Thought leadership"],
    "competitorUrls": ["https://competitor.com"],
    "topicsToAvoid": ["Pricing", "Internal processes"],
    "preferredLength": "LONG_FORM",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-15T14:30:00.000Z"
  }
}
```

**Error** (403 Forbidden):

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not a member of this organization",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

**Error** (404 Not Found):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Organization not found",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

**Frontend Use Case**: Use this endpoint for routes like `/org/:slug` instead of passing database IDs in URLs. Slugs are human-readable and SEO-friendly.

---

### `PUT /api/v1/organizations/:orgId`

Update an organization (requires OWNER or ADMIN role).

**Authentication**: Required (must be OWNER or ADMIN)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)

**Request Body**:

```json
{
  "name": "Acme Corporation",
  "mission": "Updated mission statement",
  "description": "Updated description",
  "websiteUrl": "https://newacme.com"
}
```

**Validation Rules**:

- All fields optional
- `name`: 1-100 characters if provided
- `mission`: max 1000 characters
- `description`: max 2000 characters
- `websiteUrl`: valid URL or empty string

**Response** (200 OK):

```json
{
  "id": "clorg123456789",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "mission": "Updated mission statement",
  "description": "Updated description",
  "websiteUrl": "https://newacme.com",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:30:00.000Z"
}
```

**Error** (403 Forbidden):

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to update this organization",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

---

## Content Settings

### `GET /api/v1/settings/:organizationId`

Get content settings for an organization.

**Authentication**: Required

**URL Parameters**:

- `organizationId` - Organization's database ID (cuid)

**Response** (200 OK):

```json
{
  "id": "clset123456789",
  "organizationId": "clorg123456789",
  "primaryKeywords": ["AI", "SaaS", "Automation"],
  "secondaryKeywords": ["Machine Learning", "APIs"],
  "frequency": "WEEKLY",
  "planningPeriod": "QUARTERLY",
  "tone": "professional",
  "targetAudience": "B2B SaaS founders",
  "industry": "Technology",
  "goals": ["Lead generation", "Thought leadership"],
  "competitorUrls": ["https://competitor.com"],
  "topicsToAvoid": ["Pricing", "Internal processes"],
  "preferredLength": "LONG_FORM",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-15T14:30:00.000Z"
}
```

**Error** (404 Not Found):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Content settings not found",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

---

### `PUT /api/v1/settings/:organizationId`

Update or create (upsert) content settings for an organization.

**Authentication**: Required

**URL Parameters**:

- `organizationId` - Organization's database ID (cuid)

**Request Body** (all fields optional for update):

```json
{
  "primaryKeywords": ["Updated", "Keywords"],
  "secondaryKeywords": ["New", "Secondary"],
  "frequency": "MONTHLY",
  "planningPeriod": "YEARLY",
  "tone": "witty",
  "targetAudience": "Updated target audience",
  "industry": "Updated industry",
  "goals": ["New goal 1", "New goal 2"],
  "competitorUrls": ["https://newcompetitor.com"],
  "topicsToAvoid": ["New topic to avoid"],
  "preferredLength": "SHORT_FORM"
}
```

**Validation Rules** (when creating, if settings don't exist):

- `primaryKeywords`: Required, array 1-10 items
- All other fields same as organization creation

**Response** (200 OK):

```json
{
  "id": "clset123456789",
  "organizationId": "clorg123456789",
  "primaryKeywords": ["Updated", "Keywords"],
  "secondaryKeywords": ["New", "Secondary"],
  "frequency": "MONTHLY",
  "planningPeriod": "YEARLY",
  "tone": "witty",
  "targetAudience": "Updated target audience",
  "industry": "Updated industry",
  "goals": ["New goal 1", "New goal 2"],
  "competitorUrls": ["https://newcompetitor.com"],
  "topicsToAvoid": ["New topic to avoid"],
  "preferredLength": "SHORT_FORM",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:45:00.000Z"
}
```

---

## Webhooks

### `POST /api/v1/webhooks/clerk`

Clerk webhook endpoint for user lifecycle events. **Not meant to be called by frontend**.

**Authentication**: Svix signature verification (not Clerk JWT)

**Headers Required**:

```
svix-id: msg_xxxxx
svix-timestamp: 1234567890
svix-signature: v1,signature_here
```

**Request Body** (example - user.created):

```json
{
  "type": "user.created",
  "data": {
    "id": "user_2a1b2c3d4e5f",
    "email_addresses": [
      {
        "email_address": "john@example.com"
      }
    ],
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Supported Events**:

- `user.created` - Creates user in database
- `user.updated` - Updates user email/name
- `user.deleted` - Deletes user from database

**Response** (200 OK):

```json
{
  "success": true
}
```

**Error** (400 Bad Request - Invalid signature):

```json
{
  "error": "Invalid webhook signature"
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Optional additional details or array of validation errors",
    "timestamp": "2025-12-17T10:00:00.000Z"
  }
}
```

### Common Error Codes:

- `VALIDATION_ERROR` (400) - Request validation failed
- `UNAUTHORIZED` (401) - Missing or invalid authentication token
- `FORBIDDEN` (403) - User doesn't have permission
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `DATABASE_ERROR` (400) - Database operation failed
- `INTERNAL_ERROR` (500) - Unexpected server error

---

## Rate Limiting

Currently not implemented. Will be added before production launch.

---

## CORS Configuration

Allowed origins:

- `http://localhost:5173` (Vite dev server)
- Production frontend URL (from `FRONTEND_URL` env var)

Credentials: Enabled (cookies/auth headers allowed)

---

## Notes for Frontend Integration

1. **Auto-create users**: When creating an organization, if the user doesn't exist in the database, they'll be automatically created from Clerk data.

2. **Organization slug**: Use the `slug` field for URLs (e.g., `/org/acme-corp`) rather than IDs.

3. **Atomic onboarding**: The `POST /organizations` endpoint supports creating both organization and content settings in a single request - perfect for a 2-step wizard.

4. **Error handling**: Always check the `error.code` field to handle specific error types in the UI.

5. **Validation**: Frontend should use the same Zod schemas for client-side validation before submission.
