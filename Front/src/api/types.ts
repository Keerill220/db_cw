// Types mirror Back/StudioBooking.Api DTOs (camelCase via Json options)
export type Role = "Superadmin" | "Owner" | "Client";
export type AccountType = "admin" | "client";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export interface AuthResponse {
  token: string;
  role: Role;
  userId: number;
  accountType: AccountType;
  expiresAt: string;
}

export interface MeResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
  accountType: AccountType;
}

export interface PagedResult<T> {
  page: number;
  pageSize: number;
  total: number;
  data: T[];
}

export interface City { cityId: number; name: string; country: string; }
export interface EquipmentType { typeId: number; name: string; description?: string | null; }

export interface Studio {
  studioId: number;
  name: string;
  cityName: string;
  country: string;
  address: string;
  description?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  adminId: number;
  createdAt: string;
}

export interface RoomSummary {
  roomId: number;
  name: string;
  areaSqm: number;
  pricePerHour: number;
  isAvailable: boolean;
  photoUrl?: string | null;
}

export interface StudioDetail extends Studio {
  rooms: RoomSummary[];
}

export interface EquipmentSummary {
  equipmentId: number;
  name: string;
  typeName: string;
  condition?: string | null;
  pricePerHour: number;
}

export interface BusySlot { startTime: string; endTime: string; }

export interface RoomDetail {
  roomId: number;
  studioId: number;
  studioName: string;
  name: string;
  areaSqm: number;
  pricePerHour: number;
  isAvailable: boolean;
  description?: string | null;
  photoUrl?: string | null;
  equipments: EquipmentSummary[];
  busySlots: BusySlot[];
}

export interface Booking {
  bookingId: number;
  clientId: number;
  clientName: string;
  roomId: number;
  roomName: string;
  studioName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  note?: string | null;
}

export interface BookingCreate {
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  note?: string | null;
  equipmentIds?: number[];
}

export interface AdminUser {
  adminId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
}

export interface AdminCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: "Owner" | "Superadmin";
}

export interface ProfileUpdate { firstName: string; lastName: string; phone?: string | null; }
export interface ChangePassword { currentPassword: string; newPassword: string; }

export interface OccupancyReportItem {
  studioId: number;
  studioName: string;
  month: number;
  year: number;
  totalBookings: number;
  occupiedHours: number;
}

export interface RevenueReportItem {
  studioId: number;
  studioName: string;
  month: number;
  year: number;
  revenue: number;
}

export interface TopRoom {
  roomId: number;
  roomName: string;
  studioName: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface StudioCreate {
  name: string;
  cityId: number;
  address: string;
  description?: string | null;
  photoUrl?: string | null;
}

export interface StudioUpdate extends StudioCreate { isActive: boolean; }

export interface RoomCreate {
  studioId: number;
  name: string;
  areaSqm: number;
  pricePerHour: number;
  description?: string | null;
  photoUrl?: string | null;
}

export interface RoomUpdate {
  name: string;
  areaSqm: number;
  pricePerHour: number;
  isAvailable: boolean;
  description?: string | null;
  photoUrl?: string | null;
}

export interface EquipmentCreate {
  roomId: number;
  typeId: number;
  name: string;
  condition?: string | null;
  pricePerHour: number;
}

export interface EquipmentUpdate {
  typeId: number;
  name: string;
  condition?: string | null;
  pricePerHour: number;
}

export interface Equipment {
  equipmentId: number;
  roomId: number;
  typeId: number;
  typeName: string;
  name: string;
  condition?: string | null;
  pricePerHour: number;
}
