import {
    Checkbox,
    FormLabel,
    CheckboxGroup,
    FormControl,
    HStack,
} from "@chakra-ui/react";
import { memo } from "react";

interface Props {
    grades: number[];
    selectGrades: (value: (string | number)[]) => void;
}

const SelectGrade = ({ grades, selectGrades }: Props) => {
    return (
        <FormControl>
            <FormLabel>학년</FormLabel>
            <CheckboxGroup value={grades} onChange={selectGrades}>
                <HStack spacing={4}>
                    {[1, 2, 3, 4].map((grade) => (
                        <Checkbox key={grade} value={grade}>
                            {grade}학년
                        </Checkbox>
                    ))}
                </HStack>
            </CheckboxGroup>
        </FormControl>
    );
};

export default memo(SelectGrade);