import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 8080;

  app.use(express.json());
  app.use(cors());

  const server = new ApolloServer({
    typeDefs: `
        
        type User {
            id : ID!
            name : String!
            email  : String!
            website : String!
        }
        type Todo {
            id : ID!
            title : String!
            completed : Boolean
            userId  : ID!
            user  : User
        }

        type Query {
            getTodos: [Todo]
            getUsers : [User]
            getUser(id : ID!): User
        }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.id}`
            )
          ).data,
      },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

startServer();
