const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require('../utils/s3Client'); // Helper function that creates Amazon S3 service client module.
const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id)
        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    getFileUploadURL: async (parent, args) => {
      try{
        const bucketParams = {
          Bucket: '360shopping',
          Key: `product-img/${uuidv4()}-${Date.now().toString()}`
        };
        const command = new PutObjectCommand(bucketParams);
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          return { signedUrl }
      }catch(err){
        console.log(err);
      }
    }
  },
  Mutation: {
    fileUploadURL: async (parent, args) => {
    try{
      const bucketParams = {
        Bucket: '360shopping',
        Key: `product-img/${uuidv4()}-${Date.now().toString()}`
      };
      const command = new PutObjectCommand(bucketParams);
      const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        return { signedUrl }
    }catch(err){
      console.log(err);
    }
  },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    
  }
};

module.exports = resolvers;
