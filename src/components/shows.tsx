import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    useToast,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    Radio,
    RadioGroup,
    Badge,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionPanel,
    AccordionIcon
} from "@chakra-ui/core";

export function HorseShows(): JSX.Element {
    const [ringStartTime, setRingStartTime] = useState<number>(390);
    const [numDivisions, setNumDivisions] = useState<number>(0);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [numTrips, setNumTrips] = useState<number>(0);
    const [classType, setClassType] = useState<string>("");
    const [numClass, setNumClass] = useState<number>(0);
    const [divisionType, setdivisionType] = useState<string>("");
    const [localDivisions, setLocalDivisions] = useState<Division[]>(divisions);
    const [estimatedTime, setEstimatedTime] = useState<string>("");
    const [submitClicked, setSubmitClicked] = useState(false);
    const [hack, setHack] = useState<boolean>(false);
    const [mornaft, setmornaft] = useState<string>("");
    const [jog, setJog] = useState<boolean>(true);
    const [heightchange, setheightchange] = useState<boolean>(false);
    const [coursewalk, setcoursewalk] = useState<boolean>(false);
    const [anxious, setAnxious] = useState<boolean>(false);
    const toast = useToast();

    const calculateEstimatedStartTime = () => {
        let time = ringStartTime;

        divisions.map((division) => {
            division.classes.map((classData) => {
                if (classData.classType === "O/F") {
                    time += classData.numTrips * 2; // O/F takes 2 minutes per trip
                } else if (classData.classType === "Medal/Classic/Derby") {
                    time += classData.numTrips * 2.5; // Medal/Classic/Derby takes 3 minutes per trip
                } else if (classData.classType === "II.1") {
                    time += classData.numTrips * 2; // Speed classes take 2 minutes per trip
                } else if (classData.classType === "II.2b") {
                    time += classData.numTrips * 2.5; // Classes 2b 3 minutes per trip
                } else if (classData.classType === "II.2a") {
                    time += classData.numTrips * 4; // Classes 2a 3 minutes per trip
                } else if (classData.classType === "II.2c") {
                    time += classData.numTrips * 2; // Classes 2c 3 minutes per trip
                }
            });
            if (division.hackBool === true) {
                time += 7;
            }
            if (division.heightchangeBool === true) {
                time += 3;
            }
            if (division.jogBool === true) {
                time += 5;
            }

            if (division.coursewalkBool === true) {
                time += 10;
            }
        });
        if (anxious === true) {
            if (time - 30 > ringStartTime) {
                time = time - 30;
            } else if (time - 30 <= ringStartTime) {
                time = ringStartTime;
            }
        }

        // Convert time to hours and minutes format
        let hours = Math.floor(time / 60);
        let minutes = time % 60;

        if (Math.floor((time % 60) * 10) % 10 === 5) {
            minutes = Math.floor(time % 60);
        }
        if (hours > 12) {
            setmornaft("PM");
            hours = hours - 12;
        } else {
            setmornaft("AM");
        }

        // Update estimatedTime state
        const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
        setEstimatedTime(formattedTime);
    };

    useEffect(() => {
        setDivisions(divisions);
        setRingStartTime(ringStartTime);
        setEstimatedTime(estimatedTime);
        setClassType(classType);
        setNumDivisions(numDivisions);
        setNumTrips(numTrips);
        setNumClass(numClass);
        setdivisionType(divisionType);
        setHack(hack);
        setJog(jog);
        setheightchange(heightchange);
        setcoursewalk(coursewalk);
        calculateEstimatedStartTime();
    }, [divisions, submitClicked]);

    useEffect(() => {
        const times = estimatedTime + " " + mornaft;
        if (submitClicked) {
            toast({
                title: "The Earliest Time Your Division Will Start at is Approx:",
                description: times,
                status: "success",
                duration: 9000,
                isClosable: true
            });
            setSubmitClicked(false); // Reset the flag
        }
    }, [submitClicked]);

    useEffect(() => {
        // This code will run whenever submitClicked changes to true
        // You can place any logic here that you want to re-run after submit
        // For example, updating data or resetting the submit flag

        if (submitClicked) {
            // Update or reset data as needed
            setSubmitClicked(false); // Reset the flag
        }
    }, [submitClicked]);

    const handleRingStartTimeChange = (value: string) => {
        const time = parseInt(value);
        setRingStartTime(time);
    };

    const handleNumDivisionsChange = (value: string | number) => {
        const numDivs = parseInt(value as string);
        setNumDivisions(numDivs);
        setDivisions([]);

        const newDivisions: Division[] = Array.from(
            { length: numDivs },
            () => ({
                divisionType: "",
                numClasses: 0,
                classes: [],
                hackBool: false,
                jogBool: false,
                heightchangeBool: false,
                coursewalkBool: false
            })
        );

        setDivisions(newDivisions);
        setLocalDivisions(newDivisions);
    };

    /*     const handleNumClassesChange = (divIndex: number, value: number) => {
        setNumClass(value);
        divisions[divIndex].numClasses = value;
        const newClassNum: ClassData[] = Array.from(
            { length: divisions[divIndex] },
            () => ({})
        );
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divIndex].numClasses = value;
        setLocalDivisions(updatedDivisions);
    }; */

    const handleNumClassesChange = (divIndex: number, value: number) => {
        const updatedDivisions = [...localDivisions];
        setNumClass(value);
        // Create a new array of ClassData objects with the specified length
        const newClasses: ClassData[] = Array.from({ length: value }, () => ({
            classType: "",
            numTrips: 0,
            hackBool: true,
            jogBool: true,
            heightchangeBool: true,
            coursewalkBook: true
        }));

        // Update the classes array in the specific division
        divisions[divIndex].classes = newClasses;
        divisions[divIndex].numClasses = value;
        updatedDivisions[divIndex].classes = newClasses;
        updatedDivisions[divIndex].numClasses = value;

        // Update the localDivisions state
        setLocalDivisions(updatedDivisions);
    };

    const handlehackChange = (divIndex: number) => {
        setHack(!divisions[divIndex].hackBool);
        divisions[divIndex].hackBool = !divisions[divIndex].hackBool;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divIndex] = {
            ...updatedDivisions[divIndex]
        };
        setLocalDivisions(updatedDivisions);
    };

    const handleAnxious = () => {
        setAnxious(!anxious);
    };

    const handleJogChange = (divIndex: number) => {
        setJog(!divisions[divIndex].jogBool);
        divisions[divIndex].jogBool = !divisions[divIndex].jogBool;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divIndex] = {
            ...updatedDivisions[divIndex]
        };
        setLocalDivisions(updatedDivisions);
    };

    const handleheightChange = (divIndex: number) => {
        setheightchange(!divisions[divIndex].heightchangeBool);
        divisions[divIndex].heightchangeBool =
            !divisions[divIndex].heightchangeBool;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divIndex] = {
            ...updatedDivisions[divIndex]
        };
        setLocalDivisions(updatedDivisions);
    };

    const handleCourseWalk = (divIndex: number) => {
        setcoursewalk(!divisions[divIndex].coursewalkBool);
        divisions[divIndex].coursewalkBool =
            !divisions[divIndex].coursewalkBool;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divIndex] = {
            ...updatedDivisions[divIndex]
        };
        setLocalDivisions(updatedDivisions);
    };

    const handleClassTypeChange = (
        divIndex: number,
        classIndex: number,
        value: string
    ) => {
        setClassType(value);
        divisions[divIndex].classes[classIndex].classType = value;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divIndex].classes[classIndex].classType = value;
        setLocalDivisions(updatedDivisions);
    };

    const handleDivisionTypeChange = (divisionIndex: number, type: string) => {
        setdivisionType(type);
        divisions[divisionIndex].divisionType = type;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divisionIndex].divisionType = type;
        setLocalDivisions(updatedDivisions);
    };

    const handleNumTripsChange = (
        divisionIndex: number,
        classIndex: number,
        value: number
    ) => {
        setNumTrips(value);
        divisions[divisionIndex].classes[classIndex].numTrips = value;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divisionIndex].classes[classIndex].numTrips = value;
        setLocalDivisions(updatedDivisions);
    };

    // Functions for handling class data, trips, and checkboxes...

    return (
        <Box p={8}>
            <div className="heading">
                <FormControl>
                    <FormLabel>Choose Your Ring Start Time:</FormLabel>
                    <Select
                        value={ringStartTime.toString()}
                        onChange={(e) =>
                            handleRingStartTimeChange(e.target.value)
                        }
                    >
                        <option value="390">6:30am</option>
                        <option value="420">7:00am</option>
                        <option value="435">7:15am</option>
                        <option value="450">7:30am</option>
                        <option value="480">8:00am</option>
                        <option value="510">8:30am</option>
                        <option value="540">9:00am</option>
                        <option value="570">9:30am</option>
                        <option value="600">10:00am</option>
                        <option value="630">10:30am</option>
                        <option value="660">11:00am</option>
                        <option value="690">11:30am</option>
                        <option value="720">12:00pm</option>

                        {/* Options for start time */}
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>
                        Enter Number of Divisions Before Yours:
                    </FormLabel>
                    <NumberInput
                        defaultValue={0}
                        min={0}
                        max={20}
                        onChange={handleNumDivisionsChange}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
            </div>

            {divisions.map((division, divisionIndex) => (
                <Box key={divisionIndex} mt={4}>
                    <Accordion allowMultiple allowToggle>
                        <AccordionItem>
                            <AccordionHeader>
                                <Box flex="1">
                                    <Badge fontSize="lg">
                                        Division {divisionIndex + 1}
                                    </Badge>
                                </Box>
                                <AccordionIcon />
                            </AccordionHeader>
                            <AccordionPanel pb={4}>
                                <Box borderWidth="1px" pb="10px">
                                    <FormControl>
                                        <FormLabel textAlign={"left"}>
                                            Division Type:
                                        </FormLabel>
                                        <br></br>
                                        {/*                    <Select
                            value={division.divisionType}
                            onChange={(e) =>
                                handleDivisionTypeChange(
                                    divisionIndex,
                                    e.target.value
                                )
                            }
                        >
                            <option value=" "></option>
                            <option value="Hunter/Equitation">
                                Hunter/Equitation
                            </option>
                            <option value="Jumper">Jumper</option>
                        </Select> */}

                                        <RadioGroup
                                            defaultValue=""
                                            spacing={5}
                                            isInline
                                            variantColor="teal"
                                            onChange={(e) =>
                                                handleDivisionTypeChange(
                                                    divisionIndex,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <Radio
                                                isInvalid
                                                variantColor="teal"
                                                value="Hunter/Equitation"
                                                onChange={(e) =>
                                                    handleDivisionTypeChange(
                                                        divisionIndex,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                Hunter/Equitation
                                            </Radio>
                                            <Radio
                                                isInvalid
                                                variantColor="teal"
                                                value="Jumper"
                                                onChange={(e) =>
                                                    handleDivisionTypeChange(
                                                        divisionIndex,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                Jumper
                                            </Radio>
                                        </RadioGroup>
                                        <FormControl mt={4}>
                                            <FormLabel>
                                                Enter Number of O/F Classes In
                                                Division:
                                            </FormLabel>

                                            <NumberInput
                                                defaultValue={0}
                                                min={0}
                                                max={25}
                                                onChange={(value) =>
                                                    handleNumClassesChange(
                                                        divisionIndex,
                                                        Number(value)
                                                    )
                                                }
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>
                                        <br></br>
                                        <Grid
                                            templateColumns="repeat(2, 1fr)"
                                            gap={6}
                                        >
                                            {" "}
                                            <Box w="100%">
                                                <Checkbox
                                                    variantColor="teal"
                                                    isInvalid
                                                    onChange={() =>
                                                        handleheightChange(
                                                            divisionIndex
                                                        )
                                                    }
                                                >
                                                    Height Change After
                                                    Division?
                                                </Checkbox>
                                            </Box>
                                            <Box w="100%">
                                                <Checkbox
                                                    variantColor="teal"
                                                    isInvalid
                                                    onChange={() =>
                                                        handleJogChange(
                                                            divisionIndex
                                                        )
                                                    }
                                                >
                                                    Division Has a Jog?
                                                </Checkbox>
                                            </Box>
                                            <Box w="100%">
                                                <Checkbox
                                                    variantColor="teal"
                                                    isInvalid
                                                    onChange={() =>
                                                        handleCourseWalk(
                                                            divisionIndex
                                                        )
                                                    }
                                                >
                                                    Course Walk After Division?
                                                </Checkbox>
                                            </Box>
                                            <Box w="100%">
                                                <Checkbox
                                                    variantColor="teal"
                                                    isInvalid
                                                    onChange={() =>
                                                        handlehackChange(
                                                            divisionIndex
                                                        )
                                                    }
                                                >
                                                    Division Has an U/S?{" "}
                                                </Checkbox>
                                            </Box>
                                        </Grid>
                                        <Grid
                                            templateColumns="repeat(3, 1fr)"
                                            gap={6}
                                        >
                                            {Array.from({
                                                length: divisions[divisionIndex]
                                                    .numClasses
                                            }).map((_, classIndex) => (
                                                <Box key={classIndex} mt={4}>
                                                    <Box w="100%">
                                                        <FormControl mt={4}>
                                                            {divisions[
                                                                divisionIndex
                                                            ].divisionType ===
                                                                "Hunter/Equitation" && (
                                                                <>
                                                                    <div className="heading">
                                                                        <Badge
                                                                            variant="outline"
                                                                            variantColor="teal"
                                                                            fontSize="md"
                                                                        >
                                                                            Class{" "}
                                                                            {classIndex +
                                                                                1}{" "}
                                                                        </Badge>
                                                                    </div>
                                                                    <FormLabel>
                                                                        Type:
                                                                    </FormLabel>
                                                                    <Select
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleClassTypeChange(
                                                                                divisionIndex,
                                                                                classIndex,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value=""></option>
                                                                        <option value="O/F">
                                                                            O/F
                                                                        </option>
                                                                        <option value="Medal/Classic/Derby">
                                                                            Medal/Classic/Derby
                                                                        </option>
                                                                    </Select>

                                                                    {division.numClasses >
                                                                        0 && (
                                                                        <>
                                                                            <FormLabel>
                                                                                Number
                                                                                of
                                                                                Trips
                                                                                :
                                                                            </FormLabel>
                                                                            <NumberInput
                                                                                defaultValue={
                                                                                    0
                                                                                }
                                                                                min={
                                                                                    0
                                                                                }
                                                                                max={
                                                                                    200
                                                                                }
                                                                                onChange={(
                                                                                    value
                                                                                ) =>
                                                                                    handleNumTripsChange(
                                                                                        divisionIndex,
                                                                                        classIndex,
                                                                                        Number(
                                                                                            value
                                                                                        )
                                                                                    )
                                                                                }
                                                                            >
                                                                                <NumberInputField />
                                                                                <NumberInputStepper>
                                                                                    <NumberIncrementStepper />
                                                                                    <NumberDecrementStepper />
                                                                                </NumberInputStepper>
                                                                            </NumberInput>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                            {divisions[
                                                                divisionIndex
                                                            ].divisionType ===
                                                                "Jumper" && (
                                                                <>
                                                                    <div className="heading">
                                                                        <Badge
                                                                            variant="outline"
                                                                            variantColor="teal"
                                                                            fontSize="md"
                                                                        >
                                                                            Class{" "}
                                                                            {classIndex +
                                                                                1}{" "}
                                                                        </Badge>
                                                                    </div>
                                                                    <FormLabel>
                                                                        Type:
                                                                    </FormLabel>
                                                                    <Select
                                                                        // value={division.divisionType}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleClassTypeChange(
                                                                                divisionIndex,
                                                                                classIndex,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value=""></option>
                                                                        <option value="II.1">
                                                                            II.1
                                                                            -
                                                                            Speed
                                                                        </option>
                                                                        <option value="II.2a">
                                                                            II.2a
                                                                            -
                                                                            Delayed
                                                                            Jumpoff
                                                                        </option>
                                                                        <option value="II.2b">
                                                                            II.2b
                                                                            -
                                                                            Immediate
                                                                            Jumpoff
                                                                        </option>
                                                                        <option value="II.2c">
                                                                            II.2c
                                                                            -
                                                                            Power
                                                                            &
                                                                            Speed
                                                                        </option>
                                                                    </Select>
                                                                    <FormLabel>
                                                                        Number
                                                                        of Trips
                                                                        :
                                                                    </FormLabel>
                                                                    <NumberInput
                                                                        defaultValue={
                                                                            0
                                                                        }
                                                                        min={0}
                                                                        max={
                                                                            200
                                                                        }
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            handleNumTripsChange(
                                                                                divisionIndex,
                                                                                classIndex,
                                                                                Number(
                                                                                    value
                                                                                )
                                                                            )
                                                                        }
                                                                    >
                                                                        <NumberInputField />
                                                                        <NumberInputStepper>
                                                                            <NumberIncrementStepper />
                                                                            <NumberDecrementStepper />
                                                                        </NumberInputStepper>
                                                                    </NumberInput>
                                                                </>
                                                            )}
                                                        </FormControl>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Grid>
                                    </FormControl>
                                </Box>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Box>
            ))}
            <br></br>
            <Checkbox isInvalid onChange={() => handleAnxious()}>
                I{"'"}m Feeling Anxious About Timing
            </Checkbox>
            <br></br>
            <div className="heading">
                <Button
                    onClick={() => {
                        calculateEstimatedStartTime();
                        setSubmitClicked(true);
                    }}
                >
                    Calculate
                </Button>
            </div>
        </Box>
    );
}

interface ClassData {
    classType: string;
    numTrips: number;
}

interface Division {
    divisionType: string;
    numClasses: number;
    classes: ClassData[];
    hackBool: boolean;
    jogBool: boolean;
    heightchangeBool: boolean;
    coursewalkBool: boolean;
}

export default HorseShows;
