import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { memo } from "react";

interface GradesCheckboxProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export const GradesCheckbox = memo(
  ({ value, onChange }: GradesCheckboxProps) => {
    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={value}
          onChange={(selected) => onChange(selected.map(Number))}
        >
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
  }
);

GradesCheckbox.displayName = "GradesCheckbox";
