export interface ICreateCollection {
  name: string;
}

export interface IAddMovieToCollection {
  movieDetails: {
    title: string;
    year: string;
    imdbID: string;
    type: string;
    poster: string;
  };
}
