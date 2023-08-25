import React from "react";
import { ThemeProvider } from "@chakra-ui/core";
//import { Image } from "@chakra-ui/core";
import { HorseShows } from "./components/shows";

import "./App.css";
function App(): JSX.Element {
    return (
        <ThemeProvider>
            <div>
                <div className="App">
                    <header className="App-header">
                        {" "}
                        <div className="heading">Ride Time Calculator</div>
                    </header>
                    <br></br>
                </div>
                <HorseShows></HorseShows>
            </div>
        </ThemeProvider>
    );
}

export default App;
