import { ApolloServer } from 'apollo-server';
import { createSchema } from './schema';
import config from './config';

export default async function server(): Promise<void> {
  const apollo = new ApolloServer({
    schema: await createSchema(),
    playground: config.debug,
  });

  const { url } = await apollo.listen({ port: 5000, playground: false });

  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
}
