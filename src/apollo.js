import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import nhost from './nhost'

const httpLink = createHttpLink({
  uri: nhost.graphql.httpUrl,
})

const authLink = setContext((_, { headers }) => {
  const accessToken = nhost.auth.getAccessToken()

  return {
    headers: {
      ...headers,
      ...(accessToken
        ? { authorization: `Bearer ${accessToken}` }
        : { role: 'public' }),
    },
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  devtools: {
    enabled: false,
  },
})

export default apolloClient
