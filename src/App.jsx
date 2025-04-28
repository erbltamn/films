import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // ✅ Оставляем как есть

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMovieList, setShowMovieList] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    console.log("Loading started:", isLoading);
    setErrorMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const endpoint = query
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&sort_by=popularity.desc`
        : `${API_BASE_URL}?sort_by=popularity.desc`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (!data.results) {
        setErrorMessage("No movies found.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      console.log("Updated movie list:", data.results);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2
            onClick={() => {
              setShowMovieList(!showMovieList);
              console.log("Show movie list:", showMovieList);
            }}
            className="mt-[40px] cursor-pointer"
          >
            All Movies
          </h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="movie-list visible">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
