import { FormEvent, Key, useState } from "react";
import axios from "axios";
import "./App.css";

type User = {
  id: Key | null | undefined;
  login: any;
  name: string;
  avatar_url: string;
  html_url: string;
  location: string;
  email: string;
  public_repos: number;
};

type SearchResult = {
  total_count: number;
  items: User[];
};

function App() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    axios
      .get(`https://api.github.com/search/users?q=${query}&per_page=10`)
      .then((response) => {
        setSearchResult(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError("An error occurred. Please try again later.");
      });
  };

  const handlePageChange = (page: number) => {
    setLoading(true);

    axios
      .get(
        `https://api.github.com/search/users?q=${query}&per_page=10&page=${page}`
      )
      .then((response) => {
        setSearchResult(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError("An error occurred. Please try again later.");
      });
  };
  return (
    <div className="container">
      <h1 className="title">Buscador de perfis no GitHub</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter a search term"
        />
        <button className="button" type="submit">
          Procurar
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {searchResult && (
        <>
          <p className="total-count">
            {searchResult.total_count} perfis encontrados
          </p>
          <div className="user-list">
            {searchResult.items.map((user) => (
              <div className="user-profile" key={user.html_url}>
                <h2 className="user-name">{user.name}</h2>

                <div key={user.id} className="user-card">
                  <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="user-avatar"
                  />
                  <button
                    className="user-profile-link"
                    onClick={() => handleUserClick(user)}
                  >
                    Detalhes
                  </button>
                  <div className="user-info">
                    <h2 className="user-name">{user.login}</h2>
                  </div>
                </div>

                <a className="user-profile-link" href={user.html_url}>
                  Visite o perfil no GitHub
                </a>
              </div>
            ))}

            {selectedUser && isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setIsModalOpen(false)}>
                    &times;
                  </span>
                  <h2 className="user-name">{selectedUser.name}</h2>
                  <img
                    className="user-avatar"
                    src={selectedUser.avatar_url}
                    alt={`${selectedUser.name}'s avatar`}
                  />
                  <p className="user-profile-link">{selectedUser.html_url}</p>
                  <p className="user-location">{selectedUser.login}</p>
                  <p className="user-email">{selectedUser.email}</p>
                  <p className="user-public_repos">
                    {selectedUser.public_repos}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(searchResult.total_count / 10) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                className="page-button"
                disabled={
                  loading || (page === 1 && searchResult.items.length === 0)
                }
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
