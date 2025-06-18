export interface CommonResponse {
  response: boolean;
  message: string;
}

export interface getTahunAjaranService extends CommonResponse {
  data: { id: number; name?: string | null; created_at: Date }[];
}
