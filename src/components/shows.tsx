import React, { useState } from "react";
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

const minutesPerTrip: Record<string, number> = {
    "O/F": 2,
    "U/S": 10,
    Jog: 7,
    "Medal/Classic/Derby": 2.5,
    "2": 2,
    "2a": 2,
    "2b": 2
};

function calculateEstimatedStartTime(
    start: number,
    trips: number,
    type: string,
    checkboxes: boolean[]
) {
    let estimatedTime = start;

    if (type in minutesPerTrip) {
        estimatedTime += trips * minutesPerTrip[type];
    }

    if (checkboxes[0]) {
        estimatedTime += 15;
    }
    if (checkboxes[1]) {
        estimatedTime += 7;
    }
    if (checkboxes[2]) {
        estimatedTime += 20;
    }

    return estimatedTime;
}

export function HorseShows(): JSX.Element {
    const [ringStartTime, setRingStartTime] = useState<number>(390);
    const [numDivisions, setNumDivisions] = useState<number>(0);
    const [divisions, setDivisions] = useState<Division[]>([]);

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

    const handleClassTypeChange = (
        divIndex: number,
        classIndex: number,
        value: string
    ) => {
        divisions[divIndex].classes[classIndex].classType = value;
    };

    const handleNumClassesChange = (divIndex: number, value: number) => {
        divisions[divIndex].numClasses = value;
    };

    const handleDivisionTypeChange = (divisionIndex: number, type: string) => {
        divisions[divisionIndex].divisionType = type;
    };

    const handleNumTripsChange = (
        divisionIndex: number,
        classIndex: number,
        value: number
    ) => {
        divisions[divisionIndex].classes[classIndex].numTrips = value;
    };

    // Functions for handling class data, trips, and checkboxes...

    return (
        <Box p={8}>
            <FormControl>
                <FormLabel>Choose Your Ring Start Time:</FormLabel>
                <Select
                    value={ringStartTime.toString()}
                    onChange={(e) => handleRingStartTimeChange(e.target.value)}
                >
                    <option value="390">6:30am</option>
                    <option value="450">7:30am</option>
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
                        <Select
                            value={division.divisionType}
                            onChange={(e) =>
                                handleDivisionTypeChange(
                                    divisionIndex,
                                    e.target.value
                                )
                            }
                        >
                            <option value="Hunter/Equitation">
                                Hunter/Equitation
                            </option>
                            <option value="Jumper">Jumper</option>
                        </Select>
                        <FormControl mt={4}>
                            <FormLabel>
                                Enter Number of Classes In Division:
                            </FormLabel>
                            <NumberInput
                                defaultValue={0}
                                min={0}
                                max={20}
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
                                                // value={division.divisionType}
                                                onChange={(e) =>
                                                    handleClassTypeChange(
                                                        divisionIndex,
                                                        classIndex,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="U/S">
                                                    Under Saddle
                                                </option>
                                                <option value="O/F">O/F</option>
                                            </Select>
                                            <FormLabel>
                                                Enter Number of Trips In Class{" "}
                                                {classIndex + 1}:
                                            </FormLabel>
                                            <NumberInput
                                                defaultValue={0}
                                                min={0}
                                                max={20}
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
                                                <option value="2a">2a </option>
                                                <option value="2b">2b</option>
                                            </Select>
                                            <FormLabel>
                                                Enter Number of Trips In Class{" "}
                                                {classIndex + 1}:
                                            </FormLabel>
                                            <NumberInput
                                                defaultValue={0}
                                                min={0}
                                                max={20}
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
                                </FormControl>
                            </Box>
                        ))}
                    </FormControl>
                </Box>
            ))}

            {/* Display estimated division start times */}
            {divisions.map((division, divisionIndex) => (
                <Box key={divisionIndex} mt={4}>
                    <Text>
                        Estimated Division {divisionIndex + 1} Start Time:{" "}
                        {calculateEstimatedStartTime}
                    </Text>
                </Box>
            ))}
        </Box>
    );
}

interface ClassData {
    classType: string;
    numTrips: number;
    hackBool: boolean;
}

interface Division {
    divisionType: string;
    numClasses: number;
    classes: ClassData[];
}

export default HorseShows;
