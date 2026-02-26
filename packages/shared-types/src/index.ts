export interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
  database: {
    connected: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
