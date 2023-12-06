import dotenv from "dotenv";
dotenv.config();

// Fetches movie data from TMDB API
const fetchMovieData = async (id) => {
    // Setup call
    const { tmdbKey } = process.env;
    
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${tmdbKey}`
        }
    };

    // Fetch data
    try {
        const data = await (await fetch(url, options)).json();
        return data;
    } catch (err) {
        throw new Error("Failed fetching data from TMDB API");
    }
};

// Formats and returns movie title with release year
const getTitle = async (data) => {
    const title = data.original_title;
    const releaseYear = (data.release_date).slice(0, 4);

    if (!title) return "Title not found!";
    return`${title} (${releaseYear})`;
};

export { fetchMovieData, getTitle };
