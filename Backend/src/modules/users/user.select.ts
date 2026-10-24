// Nunca expõe passwordHash
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  sector: true,
  jobTitle: true,
  avatarUrl: true,
  level: true,
  experience: true,
  squadId: true,
  squad: { select: { id: true, name: true } },
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;
