import { memo } from "react"
import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react"

interface Props {
  value: number[]
  onChange: (value: number[]) => void
}

export const GradesField = memo(({ value, onChange }: Props) => (
  <FormControl>
    <FormLabel>학년</FormLabel>
    <CheckboxGroup value={value} onChange={val => onChange(val.map(Number))}>
      <HStack spacing={4}>
        {[1, 2, 3, 4].map(grade => (
          <Checkbox key={grade} value={grade}>
            {grade}학년
          </Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  </FormControl>
))
