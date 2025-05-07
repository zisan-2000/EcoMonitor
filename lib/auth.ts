// This is a simplified auth implementation for demo purposes
// In a real application, you would use a proper authentication library

// Store the current user in localStorage and cookies
const USER_KEY = "eco_monitor_user"

// User roles
export type UserRole = "super_admin" | "admin" | "user" | null

// Permission types
export type Permission = "weather" | "water" | "logs" | "reports" | "users" | "settings"

// User interface
export interface User {
  id?: number
  email: string
  name: string
  role: UserRole
  permissions?: Permission[]
  status?: "active" | "inactive"
  lastActive?: string
}

// Admin types with predefined permissions
const ADMIN_TYPES = {
  weather_admin: {
    name: "Weather Admin",
    permissions: ["weather", "reports"],
  },
  water_admin: {
    name: "Water Quality Admin",
    permissions: ["water", "reports"],
  },
  system_admin: {
    name: "System Admin",
    permissions: ["logs", "settings"],
  },
}

// Mock users database
const USERS: User[] = [
  {
    id: 1,
    email: "super@example.com",
    name: "Super Admin",
    role: "super_admin",
    status: "active",
    lastActive: "Just now",
  },
  {
    id: 2,
    email: "weather@example.com",
    name: "Weather Admin",
    role: "admin",
    permissions: ADMIN_TYPES.weather_admin.permissions,
    status: "active",
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    email: "water@example.com",
    name: "Water Quality Admin",
    role: "admin",
    permissions: ADMIN_TYPES.water_admin.permissions,
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    email: "system@example.com",
    name: "System Admin",
    role: "admin",
    permissions: ADMIN_TYPES.system_admin.permissions,
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: 5,
    email: "user@example.com",
    name: "Regular User",
    role: "user",
    status: "inactive",
    lastActive: "2 days ago",
  },
]

/**
 * Sign in a user
 * @param email User email
 * @param password User password
 * @returns Promise that resolves when sign in is complete
 */
export async function signIn(email: string, password: string): Promise<User> {
  // Find user in our mock database
  const user = USERS.find((u) => u.email === email)

  if (!user) {
    throw new Error("User not found")
  }

  // In a real app, you would validate the password here
  // For demo, we'll just assume the password is correct if it's "password"
  if (password !== "password") {
    throw new Error("Invalid password")
  }

  // Update last active time
  user.lastActive = "Just now"

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Store user in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  // Also set a cookie for server-side access (middleware)
  document.cookie = `${USER_KEY}=${JSON.stringify(user)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

  return user
}

/**
 * Sign out the current user
 * @returns Promise that resolves when sign out is complete
 */
export async function signOut(): Promise<void> {
  // Clear user from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY)
  }

  // Clear the cookie
  document.cookie = `${USER_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve()
}

/**
 * Get the current user's role
 * @returns The user's role or null if not authenticated
 */
export function getUserRole(): UserRole {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return null
  }

  // Get user from localStorage
  const userJson = localStorage.getItem(USER_KEY)
  if (!userJson) {
    return null
  }

  try {
    const user = JSON.parse(userJson) as User
    return user.role
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

/**
 * Get the current user
 * @returns The user object or null if not authenticated
 */
export function getUser(): User | null {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return null
  }

  // Get user from localStorage
  const userJson = localStorage.getItem(USER_KEY)
  if (!userJson) {
    return null
  }

  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

/**
 * Check if the user is authenticated
 * @returns True if authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  return getUserRole() !== null
}

/**
 * Check if the user has permission for a specific feature
 * @param permission The permission to check
 * @returns True if the user has the permission, false otherwise
 */
export function hasPermission(permission: Permission): boolean {
  const user = getUser()

  if (!user) {
    return false
  }

  // Super admin has all permissions
  if (user.role === "super_admin") {
    return true
  }

  // Check if the user has the specific permission
  return user.permissions?.includes(permission) || false
}

/**
 * Get all permissions for the current user
 * @returns Array of permissions or empty array if not authenticated
 */
export function getUserPermissions(): Permission[] {
  const user = getUser()

  if (!user) {
    return []
  }

  // Super admin has all permissions
  if (user.role === "super_admin") {
    return ["weather", "water", "logs", "reports", "users", "settings"]
  }

  return user.permissions || []
}

/**
 * Get all users (for admin purposes)
 * @returns Array of all users
 */
export function getAllUsers(): User[] {
  return [...USERS]
}

/**
 * Add a new user (admin only)
 * @param user User data to add
 * @returns The added user
 */
export async function addUser(user: Omit<User, "id" | "lastActive" | "status">): Promise<User> {
  // Check if current user is super admin
  const currentUser = getUser()
  if (currentUser?.role !== "super_admin") {
    throw new Error("Only super admin can add users")
  }

  // Check if email already exists
  if (USERS.some((u) => u.email === user.email)) {
    throw new Error("Email already exists")
  }

  // Create new user
  const newUser: User = {
    ...user,
    id: USERS.length + 1,
    status: "active",
    lastActive: "Never",
  }

  // Add to mock database
  USERS.push(newUser)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return newUser
}

/**
 * Update a user (admin only)
 * @param id User ID to update
 * @param userData Updated user data
 * @returns The updated user
 */
export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  // Check if current user is super admin
  const currentUser = getUser()
  if (currentUser?.role !== "super_admin") {
    throw new Error("Only super admin can update users")
  }

  // Find user
  const userIndex = USERS.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Update user
  USERS[userIndex] = {
    ...USERS[userIndex],
    ...userData,
  }

  // If we're updating the current user, update localStorage and cookie
  if (currentUser?.id === id) {
    const updatedUser = USERS[userIndex]
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
    document.cookie = `${USER_KEY}=${JSON.stringify(updatedUser)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return USERS[userIndex]
}

/**
 * Delete a user (admin only)
 * @param id User ID to delete
 * @returns True if successful
 */
export async function deleteUser(id: number): Promise<boolean> {
  // Check if current user is super admin
  const currentUser = getUser()
  if (currentUser?.role !== "super_admin") {
    throw new Error("Only super admin can delete users")
  }

  // Can't delete yourself
  if (currentUser.id === id) {
    throw new Error("Cannot delete your own account")
  }

  // Find user
  const userIndex = USERS.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Delete user
  USERS.splice(userIndex, 1)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return true
}
