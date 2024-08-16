export interface EventParams {
  project_id: string;
  event_name: string;
  country_code: string;
  timestamp: number;
}

export interface DeserializedEventParams
  extends Omit<EventParams, 'timestamp'> {
  timestamp: string;
  extra_params: {};
}

export interface RedisEvent {
  value: string;
  score: number;
}
