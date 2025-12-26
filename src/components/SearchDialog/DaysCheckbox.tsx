import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { memo } from "react";
import { DAY_LABELS } from "../../constants.ts";

interface DaysCheckboxProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const DaysCheckbox = memo(({ value, onChange }: DaysCheckboxProps) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={value}
        onChange={(selected) => onChange(selected as string[])}
      >
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
});

DaysCheckbox.displayName = "DaysCheckbox";
