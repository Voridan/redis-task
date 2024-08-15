export interface EventParams {
  project_id: string;
  event_name: string;
  country_code: string;
  timestamp: number;
}

export const serializeEvent = (params: EventParams) => {
  const { country_code, event_name, project_id, timestamp, ...rest } = params;
  return `${project_id}|${event_name}|${country_code}|${timestamp}|${JSON.stringify(
    rest
  )}`;
};
