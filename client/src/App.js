import { useState } from 'react';
import './App.css';
import S3Form from './pages/s3-form';
import DisplayS3img from './components/display-s3img';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [s3ImgURL, setS3ImgURL ] = useState([]);
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <DisplayS3img s3ImgURL={s3ImgURL} />
        <S3Form setS3ImgURL={setS3ImgURL} s3ImgURL={s3ImgURL} />
      </div>
    </ApolloProvider>
  );
}

export default App;
