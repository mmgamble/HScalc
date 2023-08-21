import React, { useState, useEffect } from "react";
import {
    Box,
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
    Stack,
    Text
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
    const [hackBool, setHackBool] = useState<boolean>(true);
    const [mornaft, setmornaft] = useState<string>("AM");

    const calculateEstimatedStartTime = () => {
        let time = ringStartTime;

        divisions.map((division) => {
            division.classes.map((classData) => {
                if (classData.classType === "U/S") {
                    time = time + 10; // U/S takes 10 minutes
                } else if (classData.classType === "O/F") {
                    time += classData.numTrips * 2; // O/F takes 2 minutes per trip
                } else if (classData.classType === "Jog") {
                    time += 7; // Jog takes 7 minutes
                } else if (classData.classType === "Medal/Classic/Derby") {
                    time += classData.numTrips * 2.5; // Medal/Classic/Derby takes 25 minutes per trip
                } else if (classData.classType === "II.1") {
                    time += classData.numTrips * 2.5; // Classes 2, 2a, 2b take 20 minutes per trip
                } else if (classData.classType === "II.2b") {
                    time += classData.numTrips * 3; // Classes 2b 3 minutes per trip
                } else if (classData.classType === "II.2a") {
                    time += classData.numTrips * 3; // Classes 2b 3 minutes per trip
                } else if (classData.classType === "II.2c") {
                    time += classData.numTrips * 2.5; // Classes 2b 3 minutes per trip
                }
                if (classData.hackBool === true) {
                    time += 10;
                }
            });
        });

        // Convert time to hours and minutes format
        let hours = Math.floor(time / 60);
        const minutes = time % 60;
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
        setHackBool(hackBool);
    }, [divisions]);

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

        const newDivisions: Division[] = Array.from(
            { length: numDivs },
            () => ({
                divisionType: "",
                numClasses: 0,
                classes: []
            })
        );
        setDivisions(newDivisions);
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

    const handlehackChange = (divIndex: number, classIndex: number) => {
        setHackBool(!divisions[divIndex].classes[classIndex].hackBool);
        divisions[divIndex].classes[classIndex].hackBool =
            !divisions[divIndex].classes[classIndex].hackBool;
        const updatedDivisions = [...localDivisions];
        updatedDivisions[divIndex].classes[classIndex] = {
            ...updatedDivisions[divIndex].classes[classIndex],
            hackBool: !updatedDivisions[divIndex].classes[classIndex].hackBool
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
            <Text>
                Your Division Will Start at Approximately: {estimatedTime}
                {mornaft}
            </Text>
            <FormControl>
                <FormLabel>Choose Your Ring Start Time:</FormLabel>
                <Select
                    value={ringStartTime.toString()}
                    onChange={(e) => handleRingStartTimeChange(e.target.value)}
                >
                    <option value="390">6:30am</option>
                    <option value="450">7:30am</option>
                    <option value="480">8:00am</option>

                    {/* Options for start time */}
                </Select>
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>Enter Number of Divisions Before Yours:</FormLabel>
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

            {divisions.map((division, divisionIndex) => (
                <Box key={divisionIndex} mt={4}>
                    <Text fontSize="lg">Division {divisionIndex + 1}</Text>
                    <FormControl>
                        <FormLabel>Division Type:</FormLabel>
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
                        <Stack spacing={10} isInline>
                            <Checkbox
                                value="Hunter/Equitation"
                                onChange={(e) =>
                                    handleDivisionTypeChange(
                                        divisionIndex,
                                        e.target.value
                                    )
                                }
                            >
                                Hunter/Equitation{" "}
                            </Checkbox>
                            <Checkbox
                                value="Jumper"
                                onChange={(e) =>
                                    handleDivisionTypeChange(
                                        divisionIndex,
                                        e.target.value
                                    )
                                }
                            >
                                Jumper{" "}
                            </Checkbox>
                        </Stack>
                        <FormControl mt={4}>
                            <FormLabel>
                                Enter Number of Classes In Division:
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
                        {Array.from({
                            length: divisions[divisionIndex].numClasses
                        }).map((_, classIndex) => (
                            <Box key={classIndex} mt={4}>
                                <FormControl mt={4}>
                                    {divisions[divisionIndex].divisionType ===
                                        "Hunter/Equitation" && (
                                        <>
                                            <FormLabel>
                                                Class {classIndex + 1} Type:
                                            </FormLabel>
                                            <Select
                                                onChange={(e) =>
                                                    handleClassTypeChange(
                                                        divisionIndex,
                                                        classIndex,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value=""></option>
                                                <option value="U/S">
                                                    Under Saddle
                                                </option>
                                                <option value="Jog">Jog</option>
                                                <option value="O/F">O/F</option>
                                                <option value="Medal/Classic/Derby">
                                                    Medal/Classic/Derby
                                                </option>
                                            </Select>

                                            {division.numClasses > 0 && (
                                                <>
                                                    <FormLabel>
                                                        Enter Number of Trips In
                                                        Class {classIndex + 1}:
                                                    </FormLabel>
                                                    <NumberInput
                                                        defaultValue={0}
                                                        min={0}
                                                        max={200}
                                                        onChange={(value) =>
                                                            handleNumTripsChange(
                                                                divisionIndex,
                                                                classIndex,
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
                                                </>
                                            )}
                                            <Stack spacing={10} isInline>
                                                <Checkbox
                                                    defaultIsChecked
                                                    onChange={() =>
                                                        handlehackChange(
                                                            divisionIndex,
                                                            classIndex
                                                        )
                                                    }
                                                >
                                                    Division Has an U/S?
                                                </Checkbox>
                                                <Checkbox defaultIsChecked>
                                                    Division Has a Jog?
                                                </Checkbox>
                                                <Checkbox defaultIsChecked>
                                                    Height Change After
                                                    Division?
                                                </Checkbox>
                                            </Stack>
                                        </>
                                    )}
                                    {divisions[divisionIndex].divisionType ===
                                        "Jumper" && (
                                        <>
                                            <FormLabel>
                                                Class {classIndex + 1} Type:
                                            </FormLabel>
                                            <Select
                                                // value={division.divisionType}
                                                onChange={(e) =>
                                                    handleClassTypeChange(
                                                        divisionIndex,
                                                        classIndex,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value=""></option>
                                                <option value="II.1">
                                                    II.1 - Speed
                                                </option>
                                                <option value="II.2a">
                                                    II.2a - Delayed Jumpoff
                                                </option>
                                                <option value="II.2b">
                                                    II.2b - Immediate Jumpoff
                                                </option>
                                                <option value="II.2c">
                                                    II.2c - Power & Speed
                                                </option>
                                            </Select>
                                            <FormLabel>
                                                Enter Number of Trips In Class{" "}
                                                {classIndex + 1}:
                                            </FormLabel>
                                            <NumberInput
                                                defaultValue={0}
                                                min={0}
                                                max={200}
                                                onChange={(value) =>
                                                    handleNumTripsChange(
                                                        divisionIndex,
                                                        classIndex,
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
                                            <Stack spacing={10} isInline>
                                                <Checkbox defaultIsChecked>
                                                    Course Walk after Division?
                                                </Checkbox>
                                                <Checkbox defaultIsChecked>
                                                    Height Change After
                                                    Division?
                                                </Checkbox>
                                            </Stack>
                                        </>
                                    )}
                                </FormControl>
                            </Box>
                        ))}
                    </FormControl>
                </Box>
            ))}
            <Button
                onClick={() => {
                    calculateEstimatedStartTime();
                    setSubmitClicked(true);
                }}
            >
                Submit
            </Button>
        </Box>
    );
}

interface ClassData {
    classType: string;
    numTrips: number;
    hackBool: boolean;
    jogBool: boolean;
    heightchangeBool: boolean;
    coursewalkBook: boolean;
}

interface Division {
    divisionType: string;
    numClasses: number;
    classes: ClassData[];
}

export default HorseShows;
