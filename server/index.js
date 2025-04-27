import Fastify from 'fastify'

const fastify = Fastify({
  logger: true,
});

fastify.get('/', function (_, reply) {
  reply.send('Hello World!')
});

fastify.post('/exchange-code-github', async function (request, reply) {
  if (!request.body?.code) {
    reply.status(400).send({ error: 'Code is required' });
    return;
  }
  const rawResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Accept-Encoding": 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: request.body.code,
    }),
  })
  if (!rawResponse.ok) {
    reply.status(rawResponse.status).send({ error: 'Failed to exchange code' });
    return;
  }
  const data = await rawResponse.json();
  if (data.error) {
    reply.status(400).send({ error: data.error });
    return;
  }
  reply.status(200).send(data);
});

fastify.listen({ port: 3000 }, function (error) {
  if (error) {
    fastify.log.error(error)
    process.exit(1)
  }
});
