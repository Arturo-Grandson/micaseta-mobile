// Enums
export enum FestiveType {
  SJ = "sj", // San Juan
  F = "f", // Feria
}

export enum ProductType {
  DRINK = "drink",
  FOOD = "food",
}

export enum BoothRoleType {
  ADMIN = "admin",
  USER = "user",
}

// Interfaces
export interface User {
  id: number;
  uuid: string;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  boothMembers?: BoothMember[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booth {
  id: number;
  uuid: string;
  name: string;
}

export interface BoothMember {
  id: number;
  user: User;
  booth: Booth;
  roles: BoothRole[];
}

export interface BoothRole {
  id: number;
  name: BoothRoleType;
}

export interface Product {
  id: number;
  name: string;
  type: ProductType;
  price: number;
  booth: Booth;
}

export interface Consumption {
  id: number;
  user: User;
  product: Product;
  booth: Booth;
  festiveType: FestiveType;
  year: number;
  quantity: number;
  date: Date;
}

export interface Penalty {
  id: number;
  user: User;
  booth: Booth;
  festiveType: FestiveType;
  year: number;
  amount: number;
  reason: string;
  date: Date;
}

export interface CommonExpense {
  id: number;
  booth: Booth;
  festiveType: FestiveType;
  year: number;
  description: string;
  totalAmount: number;
  date: Date;
}

// DTO interfaces
export interface LoginRequest {
  email: string;
  password: string;
  boothId?: number;
}

export interface LoginResponse {
  statusCode: number;
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  message: string;
}

export interface SelectBoothRequest {
  userId: number;
  boothId: number;
}

export interface SelectBoothResponse {
  statusCode: number;
  success: boolean;
  data: {
    boothId: number;
    access_token: string;
    user: User;
  };
  message: string;
}

export interface CreateConsumptionItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateConsumptionRequest {
  userId: number;
  boothId: number;
  festiveType: FestiveType;
  year: number;
  date: Date;
  items: CreateConsumptionItemRequest[];
}

export interface CreatePenaltyRequest {
  festiveType: FestiveType;
  year: number;
  amount: number;
  reason: string;
  date: Date;
  userId: number;
  boothId: number;
}

export interface CreateCommonExpenseRequest {
  festiveType: FestiveType;
  year: number;
  description: string;
  totalAmount: number;
  date: Date;
  boothId: number;
}

// API response interfaces
export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  data: T;
  message: string;
}
