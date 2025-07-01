export interface CommonResponse {
  response: boolean;
  message: string;
}

export interface getTahunAjaranService extends CommonResponse {
  data: { id: number; nama?: string | null; created_at: Date }[];
}
