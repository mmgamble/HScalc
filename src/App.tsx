import React from "react";
import { ThemeProvider } from "@chakra-ui/core";
//import { Image } from "@chakra-ui/core";
import { HorseShows } from "./components/shows";

import "./App.css";
function App(): JSX.Element {
    return (
        <ThemeProvider>
            <div className="App">
                <header className="App-header">
                    {" "}
                    <div className="App">Ride Time Calculator</div>
                </header>
                <br></br>

                <HorseShows></HorseShows>
            </div>
        </ThemeProvider>
    );
}

export default App;
