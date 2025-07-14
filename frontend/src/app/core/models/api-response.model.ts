export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

export interface ParcelsResponse {
  sent: any[];
  received: any[];
}
