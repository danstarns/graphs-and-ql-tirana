const { createServer } = require("@graphql-yoga/node");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
const { gql } = require("graphql-tag");

const typeDefs = gql`
  type Movie {
    title: String!
    year: Int
    plot: String
    actors: [Person!]! @relationship(type: "ACTED_IN", direction: IN)
  }

  type Person {
    name: String!
    movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
  }
`;

const driver = neo4j.driver(
  "bolt://127.0.0.1:7687",
  neo4j.auth.basic("neo4j", "password")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

async function main() {
  const schema = await neoSchema.getSchema();

  await neoSchema.checkNeo4jCompat();

  const server = createServer({
    schema,
    port: 4000,
  });

  await server.start();
}

main();
