import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from '@chakra-ui/react';
import { memo, useState } from 'react';

export const GradeControl = memo(
  ({ allGrades, onChange }: { allGrades: Readonly<number[]>; onChange: (grades: number[]) => void }) => {
    const [grades, setGrades] = useState<number[]>([]);

    const handleChange = (value: number[]) => {
      setGrades(value);
      onChange(value);
    };

    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup value={grades} onChange={(value) => handleChange(value.map(Number))}>
          <HStack spacing={4}>
            {allGrades.map((grade) => (
              <Checkbox key={grade} value={grade}>
                {grade}학년
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  },
);
