import { useQuery, gql } from "@apollo/client";
import "./App.css";

const query = gql`
  query GetTodosWithUser {
    getTodos {
      title
      completed
      user {
        name
      }
    }
  }
`;

function App() {
  const { loading,  data } = useQuery(query);

  if (loading) return <h1>Loading...</h1>;
  return <div className="App">{JSON.stringify(data)}</div>;
}

export default App;
