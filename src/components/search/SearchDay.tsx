import { memo } from "react";
import {
    FormControl,
    FormLabel,
    CheckboxGroup,
    HStack,
    Checkbox,
} from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants";

interface Props {
    days: string[];
    selectDays: (value: (string | number)[]) => void;
}

const SelectDay = ({ days, selectDays }: Props) => {
    return (
        <FormControl>
            <FormLabel>요일</FormLabel>
            <CheckboxGroup value={days} onChange={selectDays}>
                <HStack spacing={4}>
                    {DAY_LABELS.map((day) => (
                        <Checkbox key={day} value={day}>
                            {day}
                        </Checkbox>
                    ))}
                </HStack>
            </CheckboxGroup>
        </FormControl>
    );
};

export default memo(SelectDay);