import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import Movie from "./components/Movie";

function App() {
  const [moviesCount, setMoviesCount] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);
  const [moviesWishList, setMoviesWishList] = useState([]);
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    async function loadMovies() {
      var rawMovies = await fetch("/new-movies");
      var moviesfromAPI = await rawMovies.json();
      var moviesAPI = await moviesfromAPI.movie.results;
      console.log(moviesAPI);
      setMoviesList(moviesAPI);
    }
    async function saveMyWishList() {
      var rawWishList = await fetch("/wishlist-movie");
      var wishList = await rawWishList.json();
      console.log(wishList.movieList);
      setMoviesWishList(wishList.movieList);
      setMoviesCount(wishList.movieList.length);
    }
    loadMovies();
    saveMyWishList();
  }, []);

  var handleClickAddMovie = (movieName, movieImg) => {
    setMoviesCount(moviesCount + 1);
    setMoviesWishList([...moviesWishList, { name: movieName, src: movieImg }]);
    fetch("/wishlist-movie", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${movieName}&src=${movieImg}`,
    });
  };

  var handleClickDeleteMovie = (movieName) => {
    setMoviesCount(moviesCount - 1);
    setMoviesWishList(moviesWishList.filter((movie) => movie.name !== movieName));
    fetch(`/wishlist-movie/${movieName}`, {
      method: "DELETE",
    });
  };

  var movieList = moviesList.map((movie, i) => {
    var findMovieWishList = moviesWishList.find((moviewish) => moviewish.name == movie.title);
    var isSeen = false;
    if (findMovieWishList) {
      isSeen = true;
    }

    if (!movie.backdrop_path) {
      var movieImg = "/generique.jpg";
    } else {
      var movieImg = `http://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
    }

    var movieDesc = movie.overview.substring(0, 79);
    if (movie.overview.length >= 79) {
      movieDesc = `${movieDesc}...`;
    }

    return (
      <Movie
        key={i}
        movieSeen={isSeen}
        movieName={movie.title}
        movieDesc={movieDesc}
        movieImg={movieImg}
        globalRating={movie.vote_average}
        globalCountRating={movie.vote_count}
        handleClickAddMovieParent={handleClickAddMovie}
        handleClickDeleteMovieParent={handleClickDeleteMovie}
      />
    );
  });

  var movieInMyWishList = moviesWishList.map((moviewish) => {
    return (
      <ListGroupItem onClick={() => handleClickDeleteMovie(moviewish.name)}>
        <img src={moviewish.src} alt={moviewish.name} width="30%" />
        {moviewish.name}
      </ListGroupItem>
    );
  });

  return (
    <div style={{ backgroundColor: "#232528" }}>
      <Container>
        <Nav>
          <span className="navbar-brand">
            <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo" />
          </span>
          <NavItem>
            <NavLink style={{ color: "white" }}>Last Releases</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Button type="button" id="Popover1">
                {moviesCount} films
              </Button>
              <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverHeader>Wishlist</PopoverHeader>
                <PopoverBody>
                  <ListGroup>{movieInMyWishList}</ListGroup>
                </PopoverBody>
              </Popover>
            </NavLink>
          </NavItem>
        </Nav>
        <Row>{movieList}</Row>
      </Container>
    </div>
  );
}

export default App;
