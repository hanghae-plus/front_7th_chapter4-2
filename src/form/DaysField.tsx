import { memo } from "react"
import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react"
import { DAY_LABELS } from "../constants.ts"

interface Props {
  value: string[]
  onChange: (value: string[]) => void
}

export const DaysField = memo(({ value, onChange }: Props) => (
  <FormControl>
    <FormLabel>요일</FormLabel>
    <CheckboxGroup value={value} onChange={val => onChange(val as string[])}>
      <HStack spacing={4}>
        {DAY_LABELS.map(day => (
          <Checkbox key={day} value={day}>
            {day}
          </Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  </FormControl>
))
