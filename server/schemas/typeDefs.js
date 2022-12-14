const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    email: String
  }

  type Auth {
    token: ID
    user: User
  }

  type SingedURL {
    signedUrl: String
  }

  type Query {
    user: User
    getFileUploadURL: SingedURL
  }

  type Mutation {
    addUser(email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    fileUploadURL: SingedURL
  }
`;

module.exports = typeDefs;
