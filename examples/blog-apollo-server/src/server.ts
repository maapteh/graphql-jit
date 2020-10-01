import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { executor } from './executor';

const resolversArray = loadFilesSync(`${__dirname}/resolvers`, {
    extensions: ['ts', 'js'],
});
const typeDefsArray = loadFilesSync(`${__dirname}/schema/*.gql`);

const resolvers = mergeResolvers(resolversArray);
const typeDefs = mergeTypeDefs(typeDefsArray);

import { GraphQLModule } from '@graphql-modules/core';

const graphQlModule = new GraphQLModule({
  typeDefs,
  resolvers
});

const apollo = new ApolloServer({
  schema: graphQlModule.schema,
  context: session => ({
    session,
  }),
  executor: executor(graphQlModule.schema)
});

apollo.listen({ port: 3000 }).then(() => {
  console.log('Go to http://localhost:3000/graphql to run queries!');
});
