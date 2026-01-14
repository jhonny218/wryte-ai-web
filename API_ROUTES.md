# API Routes Documentation

**Base URL**: `/api/v1`

## Quick Reference - All Available Routes

### Health

- `GET /health` - Check API and database health status

### Users

- `POST /api/v1/users/sync` - Sync current Clerk user to DB
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/me` - Update current user
- `DELETE /api/v1/users/me` - Delete current user
- `GET /api/v1/users/me/organizations` - Get user's organizations

### Organizations

- `GET /api/v1/organizations` - Get all user's organizations
- `POST /api/v1/organizations` - Create organization (with optional settings)
- `GET /api/v1/organizations/:orgId` - Get organization by ID
- `GET /api/v1/organizations/slug/:slug` - Get organization by slug
- `PUT /api/v1/organizations/:orgId` - Update organization

### Content Settings

- `GET /api/v1/settings/:organizationId` - Get content settings
- `PUT /api/v1/settings/:organizationId` - Update/create content settings

### Blog Titles

- `GET /api/v1/titles/:organizationId` - Get titles for organization
- `PUT /api/v1/titles/:orgId/:titleId` - Update a title (text/status/schedule)
- `DELETE /api/v1/titles/:orgId/:titleId` - Delete a title

### Outlines

- `GET /api/v1/outlines/:orgId` - Get outlines for organization
- `PUT /api/v1/outlines/:orgId/:outlineId` - Update an outline
- `DELETE /api/v1/outlines/:orgId/:outlineId` - Delete an outline

### Blogs

- `GET /api/v1/blogs/:orgId` - Get blogs for organization
- `PUT /api/v1/blogs/:orgId/:blogId` - Update a blog
- `DELETE /api/v1/blogs/:orgId/:blogId` - Delete a blog

### Calendar

- `GET /api/v1/calendar` - Get calendar events for an organization (query: `year`, `month`, `orgId`)

### Jobs

- `POST /api/v1/jobs/title` - Trigger title generation job
- `POST /api/v1/jobs/outline` - Trigger outline generation job
- `POST /api/v1/jobs/blog` - Trigger blog generation job
- `GET /api/v1/jobs/:jobId` - Get job status by ID

### Webhooks

- `POST /api/v1/webhooks/clerk` - Clerk webhook (user lifecycle)

All endpoints that require authentication expect a `Bearer` token (from Clerk) in the `Authorization` header.

---

## Authentication

Authentication is handled by Clerk middleware.

- **Protected Routes**: Return 401 if no token or invalid token.
- **User Resolution**: The backend automatically resolves the Clerk user ID to the database user ID.

---

## Users

### `POST /api/v1/users/sync`

Explicitly sync the current Clerk user to the database. (Optional - webhook handles this automatically usually, but good for robust frontend flow).

**Authentication**: Required

**Response** (200 OK):

```json
{
  "id": "cluser123456789",
  "email": "user@example.com",
  "clerkId": "user_2a1b2c3d4e5f"
}
```

---

## Organizations

### `GET /api/v1/users/me/organizations`

Get all organizations the current user belongs to.

**Authentication**: Required

**Response** (200 OK):

```json
[
  {
    "id": "clorg123456789",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "role": "OWNER",
    "members": [{ "role": "OWNER" }]
  }
]
```

---

### `POST /api/v1/organizations`

Create a new organization.

**Authentication**: Required

**Request Body**:

```json
{
  "name": "Acme Corp",
  "mission": "To make AI accessible",
  "name": "Acme Corp",
  "description": "Optional description",
  "websiteUrl": "https://acme.com",
  "contentSettings": {
    "primaryKeywords": ["AI", "SaaS"],
    "secondaryKeywords": ["Machine Learning"],
    "postingDaysOfWeek": ["MON", "WED"],
    "tone": "professional"
  }
}
```

**Validation**:

- `name`: Required, 1-100 chars
- `contentSettings`: Optional object to init settings immediately

**Response** (201 Created):

```json
{
  "id": "clorg123456789",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "mission": "To make AI accessible",
  "contentSettings": {
    "id": "clset123456789",
    "primaryKeywords": ["AI", "SaaS"]
  }
}
```

---

### `GET /api/v1/organizations/:orgId`

Get a specific organization by ID.

**Authentication**: Required (must be a member of the organization)

**Response** (200 OK):

```json
{
  "id": "clorg123456789",
  "name": "Acme Corp",
  ...
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
    "postingDaysOfWeek": ["MON", "WED"],
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

**Response** (200 OK):

```json
{
  "id": "clorg123456789",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "mission": "Updated mission statement",
  ...
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
  "postingDaysOfWeek": ["MON", "WED", "FRI"],
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
  "postingDaysOfWeek": ["TUE", "THU"],
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
- `postingDaysOfWeek`: Array of ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

**Response** (200 OK):

```json
{
  "id": "clset123456789",
  "organizationId": "clorg123456789",
  "primaryKeywords": ["Updated", "Keywords"],
  "secondaryKeywords": ["New", "Secondary"],
  "postingDaysOfWeek": ["TUE", "THU"],
  "tone": "witty",
  "targetAudience": "Updated target audience",
  "industry": "Updated industry",
  ...
}
```

---

## Blog Titles

### `GET /api/v1/titles/:organizationId`

Get generated blog titles for a specific organization.

**Authentication**: Required

**URL Parameters**:

- `organizationId` - Organization's database ID (cuid)

**Response** (200 OK):

```json
[
  {
    "id": "cltitle12345",
    "title": "5 Ways to Automate Your Workflow",
    "organizationId": "clorg123456789",
    "outlineId": null,
    "status": "PENDING",
    "scheduledDate": "2025-01-20T00:00:00.000Z",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
]
```

---

### `PUT /api/v1/titles/:orgId/:titleId`

Update a blog title for an organization (used to edit title text, change status, or schedule date).

**Authentication**: Required (must be a member of the organization and have permission to update titles)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)
- `titleId` - Title's database ID (cuid)

**Request Body** (any of the fields are optional — only provided fields are updated):

```json
{
  "title": "10 Ways AI Improves Productivity",
  "status": "APPROVED",
  "scheduledDate": "2025-02-01T00:00:00.000Z",
  "aiGenerationContext": { "prompt": "...", "model": "gpt-4" }
}
```

**Validation**:

- `title`: optional, string
- `status`: optional, one of `PENDING`, `APPROVED`, `REJECTED`, `REGENERATING`
- `scheduledDate`: optional, ISO date string or null to clear
- `aiGenerationContext`: optional, JSON object (for internal use)

**Response** (200 OK):

```json
{
  "id": "cltitle12345",
  "title": "10 Ways AI Improves Productivity",
  "organizationId": "clorg123456789",
  "outlineId": null,
  "status": "APPROVED",
  "scheduledDate": "2025-02-01T00:00:00.000Z",
  "aiGenerationContext": { "prompt": "...", "model": "gpt-4" },
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-02T12:00:00.000Z"
}
```

**Errors**:

- `404 Not Found` (title not found):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Title not found",
    "timestamp": "..."
  }
}
```

- `403 Forbidden` (title does not belong to org or insufficient permissions):

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to update this title",
    "timestamp": "..."
  }
}
```

**Notes**:

- The backend restricts which fields can be updated to avoid accidental overwrites; callers should only send fields they intend to change.

---

### `DELETE /api/v1/titles/:orgId/:titleId`

Delete a blog title for an organization.

**Authentication**: Required (must be a member of the organization and have permission to delete titles)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)
- `titleId` - Title's database ID (cuid)

**Response** (200 OK):

```json
{
  "success": true,
  "status": 200,
  "data": null,
  "message": "Title deleted successfully"
}
```

**Errors**:

- `404 Not Found` (title not found)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Title not found",
    "timestamp": "..."
  }
}
```

- `403 Forbidden` (title does not belong to org or insufficient permissions)

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to delete this title",
    "timestamp": "..."
  }
}
```

**Notes**:

- Deleting is permanent (DB record removed). If you need soft-delete semantics, update the service to mark titles as removed instead of deleting.
- Use this endpoint from the UI when editing title text, approving/rejecting, or scheduling.

---

## Calendar

### `GET /api/v1/calendar`

Get scheduled content events (titles) for a specific organization and month. Returns an array of scheduled titles and their dates.

**Authentication**: Required (user must be a member of the organization)

**Query Parameters** (required):

- `year` — 4-digit year (e.g. `2026`)
- `month` — month number `01`-`12` (or `1`-`12`)
- `orgId` — Organization's database ID (cuid)

Example request:

```
GET /api/v1/calendar?year=2026&month=01&orgId=clorg123456789
```

**Response** (200 OK):

```json
[
  {
    "id": "cltitle12345",
    "title": "5 Ways to Automate Your Workflow",
    "organizationId": "clorg123456789",
    "scheduledDate": "2026-01-20T00:00:00.000Z",
    "status": "PENDING"
  }
]
```

**Errors**:

- `400 Bad Request` — Missing or invalid `year`, `month`, or `orgId` query params.
- `404 Not Found` — Organization not found or invalid date range.

**Notes**:

- This endpoint returns scheduled titles within the given month (inclusive).
- If you prefer route params instead of query params, the controller accepts both (query preferred for calendar queries).

## Jobs

### `GET /api/v1/jobs/:jobId`

Poll a job's status by its ID. Useful for frontend polling after submitting a job.

**Authentication**: Required (must be same user who created the job or a member of the organization)

**URL Parameters**:

- `jobId` - Job's database ID (cuid)

**Response** (200 OK):

```json
{
  "data": {
    "id": "cljob123456789",
    "userId": "cluser12345",
    "organizationId": "clorg123456789",
    "type": "GENERATE_TITLES",
    "status": "PROCESSING",
    "input": { "dates": ["2025-01-20"] },
    "result": null,
    "error": null,
    "createdAt": "2025-01-01T12:00:00.000Z",
    "startedAt": "2025-01-01T12:01:00.000Z"
  }
}
```

**Errors**:

- `404 Not Found` (job not found)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Job not found",
    "timestamp": "..."
  }
}
```

---

### `POST /api/v1/jobs/title`

Trigger an asynchronous job to generate blog titles using Google Gemini.

**Authentication**: Required

**Request Body**:

```json
{
  "organizationId": "clorg123456789",
  "dates": ["2025-01-20", "2025-01-22", "2025-01-24"]
}
```

**Validation**:

- `organizationId`: Required string
- `dates`: Required array of date strings (ISO format YYYY-MM-DD or similar)

**Response** (202 Accepted):

```json
{
  "status": "accepted",
  "data": {
    "id": "cljob123456789",
    "userId": "cluser12345",
    "organizationId": "clorg123456789",
    "type": "GENERATE_TITLES",
    "status": "PENDING",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### `POST /api/v1/jobs/outline`

Trigger an asynchronous job to generate a blog outline using Google Gemini.

**Authentication**: Required

**Request Body**:

```json
{
  "blogTitleId": "cltitle123456789",
  "additionalInstructions": "Focus on practical examples"
}
```

**Validation**:

- `blogTitleId`: Required string (cuid)
- `additionalInstructions`: Optional string (max 1000 chars)

**Response** (202 Accepted):

```json
{
  "status": "accepted",
  "data": {
    "id": "cljob987654321",
    "userId": "cluser12345",
    "organizationId": null,
    "type": "GENERATE_OUTLINE",
    "status": "PENDING",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### `POST /api/v1/jobs/blog`

Trigger an asynchronous job to generate a full blog post using Google Gemini.

**Authentication**: Required

**Request Body**:

```json
{
  "blogOutlineId": "cloutline123456789",
  "additionalInstructions": "Keep it under 2000 words"
}
```

**Validation**:

- `blogOutlineId`: Required string (cuid)
- `additionalInstructions`: Optional string

**Response** (202 Accepted):

```json
{
  "status": "accepted",
  "data": {
    "id": "cljob555666777",
    "userId": "cluser12345",
    "organizationId": null,
    "type": "GENERATE_BLOG",
    "status": "PENDING",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## Outlines

### `GET /api/v1/outlines/:orgId`

Get all blog outlines for an organization.

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)

**Response** (200 OK):

```json
[
  {
    "id": "cloutline123456789",
    "blogTitleId": "cltitle123456789",
    "structure": {
      "sections": [
        {
          "heading": "Introduction",
          "bullets": ["Hook the reader", "Explain the problem"]
        }
      ]
    },
    "seoKeywords": ["AI", "automation"],
    "metaDescription": "Learn how AI transforms workflows",
    "suggestedImages": ["hero.jpg"],
    "status": "PENDING",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
]
```

---

### `PUT /api/v1/outlines/:orgId/:outlineId`

Update a blog outline for an organization.

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)
- `outlineId` - Outline's database ID (cuid)

**Request Body** (all fields optional):

```json
{
  "structure": {
    "sections": [
      {
        "heading": "Updated Section",
        "bullets": ["New point 1", "New point 2"]
      }
    ]
  },
  "seoKeywords": ["keyword1", "keyword2"],
  "metaDescription": "Updated meta description",
  "suggestedImages": ["image1.jpg"],
  "status": "APPROVED"
}
```

**Response** (200 OK):

```json
{
  "id": "cloutline123456789",
  "blogTitleId": "cltitle123456789",
  "structure": { "sections": [...] },
  "seoKeywords": ["keyword1", "keyword2"],
  "metaDescription": "Updated meta description",
  "suggestedImages": ["image1.jpg"],
  "status": "APPROVED",
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

---

### `DELETE /api/v1/outlines/:orgId/:outlineId`

Delete a blog outline for an organization.

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)
- `outlineId` - Outline's database ID (cuid)

**Response** (200 OK):

```json
{
  "success": true,
  "status": 200,
  "data": null,
  "message": "Outline deleted successfully"
}
```

---

## Blogs

### `GET /api/v1/blogs/:orgId`

Get all full blog posts for an organization.

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)

**Response** (200 OK):

```json
[
  {
    "id": "clblog123456789",
    "blogOutlineId": "cloutline123456789",
    "content": "# Introduction\n\nThis is the blog content...",
    "htmlContent": "<h1>Introduction</h1><p>This is the blog content...</p>",
    "wordCount": 1250,
    "status": "DRAFT",
    "publishedAt": null,
    "exportedAt": null,
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
]
```

---

### `PUT /api/v1/blogs/:orgId/:blogId`

Update a full blog post for an organization.

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)
- `blogId` - Blog's database ID (cuid)

**Request Body** (all fields optional):

```json
{
  "content": "# Updated Introduction\n\nUpdated blog content...",
  "htmlContent": "<h1>Updated Introduction</h1><p>Updated blog content...</p>",
  "wordCount": 1500,
  "status": "APPROVED",
  "publishedAt": "2025-01-15T10:00:00.000Z"
}
```

**Response** (200 OK):

```json
{
  "id": "clblog123456789",
  "blogOutlineId": "cloutline123456789",
  "content": "# Updated Introduction\n\nUpdated blog content...",
  "htmlContent": "<h1>Updated Introduction</h1><p>Updated blog content...</p>",
  "wordCount": 1500,
  "status": "APPROVED",
  "publishedAt": "2025-01-15T10:00:00.000Z",
  "exportedAt": null,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T14:00:00.000Z"
}
```

---

### `DELETE /api/v1/blogs/:orgId/:blogId`

Delete a full blog post for an organization.

**Authentication**: Required (must be a member of the organization)

**URL Parameters**:

- `orgId` - Organization's database ID (cuid)
- `blogId` - Blog's database ID (cuid)

**Response** (200 OK):

```json
{
  "success": true,
  "status": 200,
  "data": null,
  "message": "Blog deleted successfully"
}
```

---

## Webhooks

### `POST /api/v1/webhooks/clerk`

Clerk webhook endpoint for user lifecycle events.

**Authentication**: Svix signature verification.
