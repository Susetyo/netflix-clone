import React from "react";
import "./HomeScreen.css";

import Nav from "../Nav/Nav";
import Banner from "../Banner/Banner";
import Row from "../Row/Row";

import Request from "../../request";

function HomeScreen() {
    return (
        <div>
            <Nav />
            <Banner />
            <Row
                title="Trending Now"
                fetchUrl={Request.fetchTrending}
                isLargeRow={true}
            />
            <Row title="Action Movies" fetchUrl={Request.fetchHorrorMovies} />
            <Row title="Comedy Movies" fetchUrl={Request.fetchComedyMovies} />
            <Row title="Horror Movies" fetchUrl={Request.fetchHorrorMovies} />
            <Row title="Romance Movies" fetchUrl={Request.fetchRomanceMovies} />
            <Row title="Documentaries" fetchUrl={Request.fetchDocumentaries} />
        </div>
    );
}

export default HomeScreen;
