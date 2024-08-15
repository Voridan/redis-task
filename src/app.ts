import path from 'path';
import dotenv from 'dotenv';

import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

dotenv.config();

const fastify = Fastify({ forceCloseConnections: true, logger: true });

fastify.register(fastifySwagger);
fastify.register(fastifySwaggerUi);

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
});

export default {
  run: async () => {
    try {
      await fastify.listen({ port: 5000 });
    } catch (err) {
      fastify.log.error(err);
    }
  },
};
