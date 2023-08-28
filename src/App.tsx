import React from "react";
import {
    ThemeProvider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
} from "@chakra-ui/core";
//import { Image } from "@chakra-ui/core";
import { HorseShows } from "./components/shows";

import "./App.css";
function App(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <ThemeProvider>
            <div>
                <div className="App">
                    <header className="App-header">
                        {" "}
                        <div className="heading">Ride Time Calculator</div>
                    </header>
                    <br></br>
                    <>
                        <Button onClick={onOpen}> Calculator Info</Button>

                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Calculator Info</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    This calculator can be used to determine the
                                    estimated time that your division will
                                    start.
                                    <br></br>
                                    <br></br> As with any equine event, many
                                    factors play a role in the schedule. This
                                    calculator provides an estimate of the
                                    earliest time your division will run based
                                    on division/class type, number of trips and
                                    other factors (Jogs/Under Saddle
                                    Classes/Height Changes/Course Walks). Click
                                    the {"'"} feeling anxious
                                    {"' "}
                                    button to give yourself extra time.
                                    <br></br>
                                    <br></br>
                                    On show day, pay attention to class count
                                    and schedule changes - recalculate time if
                                    needed.
                                    <br></br>
                                    <br></br> Please make sure you choose the
                                    division type to enter class data.
                                </ModalBody>

                                <ModalFooter></ModalFooter>
                            </ModalContent>
                        </Modal>
                    </>
                    <br></br>
                </div>
                <HorseShows></HorseShows>
            </div>
        </ThemeProvider>
    );
}

export default App;
