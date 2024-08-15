import { EventParams } from './event.serialize';

interface DeserializedEvent extends Omit<EventParams, 'timestamp'> {
  timestamp: string;
  extra_params: {};
}

export const deserializeEvent = (event: string): DeserializedEvent => {
  const eventParams = event.split('|');
  return {
    project_id: eventParams[0],
    event_name: eventParams[1],
    country_code: eventParams[2],
    timestamp: new Date(+eventParams[3]).toISOString(),
    extra_params: JSON.parse(eventParams[4]),
  };
};
