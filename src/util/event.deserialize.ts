import { DeserializedEventParams } from '../interface';

export const deserializeEvent = (event: string): DeserializedEventParams => {
  const eventParams = event.split('|');
  const deserialized: DeserializedEventParams = {
    project_id: eventParams[0],
    event_name: eventParams[1],
    country_code: eventParams[2],
    timestamp: new Date(+eventParams[3]).toISOString(),
    extra_params: eventParams[4] ? JSON.parse(eventParams[4]) : {},
  };

  return deserialized;
};
