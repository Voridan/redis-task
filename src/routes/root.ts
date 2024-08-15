import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Object({
            wellcome: Type.String(),
          }),
        },
      },
    },
    async (req, res) => {
      return {
        wellcome: 'Wellcome to event tracker',
      };
    }
  );
};

export default plugin;
