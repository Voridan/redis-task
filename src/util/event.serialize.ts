import { EventParams } from '../interface';

export const serializeEvent = (params: EventParams) => {
  const { country_code, event_name, project_id, timestamp, ...rest } = params;
  let key = `${project_id}|${event_name}|${country_code}|${timestamp}`;
  if (Object.keys(rest).length > 0) key += `|${JSON.stringify(rest)}`;
  return key;
};
