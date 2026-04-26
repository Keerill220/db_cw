import { api } from "./client";
import type {
  PagedResult, Studio, StudioDetail, StudioCreate, StudioUpdate,
  RoomDetail, RoomCreate, RoomUpdate,
  Booking, BookingCreate,
  City, EquipmentType, Equipment, EquipmentCreate, EquipmentUpdate,
  AdminUser, AdminCreate,
  OccupancyReportItem, RevenueReportItem, TopRoom,
} from "./types";

export interface StudioFilters {
  page?: number;
  pageSize?: number;
  cityId?: number;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}

export const studios = {
  list: (params: StudioFilters = {}) =>
    api.get<PagedResult<Studio>>("/studios", { params }).then((r) => r.data),
  get: (id: number) => api.get<StudioDetail>(`/studios/${id}`).then((r) => r.data),
  create: (dto: StudioCreate) => api.post<Studio>("/studios", dto).then((r) => r.data),
  update: (id: number, dto: StudioUpdate) => api.put<Studio>(`/studios/${id}`, dto).then((r) => r.data),
  remove: (id: number) => api.delete(`/studios/${id}`).then((r) => r.data),
};

export const rooms = {
  get: (id: number, date?: string) =>
    api.get<RoomDetail>(`/rooms/${id}`, { params: date ? { date } : {} }).then((r) => r.data),
  create: (dto: RoomCreate) => api.post<RoomDetail>("/rooms", dto).then((r) => r.data),
  update: (id: number, dto: RoomUpdate) => api.put<RoomDetail>(`/rooms/${id}`, dto).then((r) => r.data),
  remove: (id: number) => api.delete(`/rooms/${id}`).then((r) => r.data),
};

export interface BookingFilters {
  page?: number;
  pageSize?: number;
  roomId?: number;
  studioId?: number;
  from?: string;
  to?: string;
  status?: string;
}

export const bookings = {
  list: (params: BookingFilters = {}) =>
    api.get<PagedResult<Booking>>("/bookings", { params }).then((r) => r.data),
  get: (id: number) => api.get<Booking>(`/bookings/${id}`).then((r) => r.data),
  create: (dto: BookingCreate) => api.post<Booking>("/bookings", dto).then((r) => r.data),
  cancel: (id: number) => api.patch<Booking>(`/bookings/${id}/cancel`).then((r) => r.data),
  confirm: (id: number) => api.patch<Booking>(`/bookings/${id}/confirm`).then((r) => r.data),
};

export const lookups = {
  cities: () => api.get<City[]>("/cities").then((r) => r.data),
  equipmentTypes: () => api.get<EquipmentType[]>("/equipment-types").then((r) => r.data),
};

export const equipment = {
  get: (id: number) => api.get<Equipment>(`/equipment/${id}`).then((r) => r.data),
  create: (dto: EquipmentCreate) => api.post<Equipment>("/equipment", dto).then((r) => r.data),
  update: (id: number, dto: EquipmentUpdate) => api.put<Equipment>(`/equipment/${id}`, dto).then((r) => r.data),
  remove: (id: number) => api.delete(`/equipment/${id}`).then((r) => r.data),
};

export const adminUsers = {
  list: (page = 1, pageSize = 20) =>
    api.get<PagedResult<AdminUser>>("/admin/administrators", { params: { page, pageSize } }).then((r) => r.data),
  create: (dto: AdminCreate) => api.post<AdminUser>("/admin/administrators", dto).then((r) => r.data),
};

export const reports = {
  occupancy: () => api.get<OccupancyReportItem[]>("/reports/occupancy").then((r) => r.data),
  revenue: () => api.get<RevenueReportItem[]>("/reports/revenue").then((r) => r.data),
  topRooms: () => api.get<TopRoom[]>("/reports/top-rooms").then((r) => r.data),
};
