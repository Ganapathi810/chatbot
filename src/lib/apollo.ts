import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { nhost } from './nhost';

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN || 'demo';
const region = import.meta.env.VITE_NHOST_REGION || 'eu-central-1';

const httpLink = createHttpLink({
  uri: `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `wss://${subdomain}.hasura.${region}.nhost.run/v1/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => ({
      headers: {
        Authorization: `Bearer ${nhost.auth.getAccessToken()}`,
      },
    }),
  },
});

const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          chats: {
            merge: false,
          },
          messages: {
            merge: false,
          },
        },
      },
      Subscription: {
        fields: {
          chats: {
            merge: false,
          },
          messages: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});