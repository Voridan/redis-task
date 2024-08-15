import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { redisClient } from '../redis';
import { serializeEvent } from '../util/event.serialize';

const EVENTS_KEY = 'events';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/track-event',
    {
      schema: {
        body: Type.Object({
          project_id: Type.String({ minLength: 6, maxLength: 10 }),
          event_name: Type.String({ minLength: 1 }),
          country_code: Type.String({ maxLength: 2 }),
          timestamp: Type.Number({ minimum: 1 }),
        }),
        response: {
          200: Type.Object({
            success: Type.Boolean(),
          }),
        },
      },
    },
    async (req, res) => {
      const member = serializeEvent(req.body);
      await redisClient.zIncrBy(EVENTS_KEY, 1, member);
      res.status(200).send({ success: true });
    }
  );
};

export default plugin;
