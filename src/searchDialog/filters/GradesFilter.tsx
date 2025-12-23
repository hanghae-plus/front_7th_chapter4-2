import { memo } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import {
  useSearchGrades,
  useSetSearchGrades,
} from '../../SearchOptionsContext';

export const GradesFilter = memo(() => {
  const grades = useSearchGrades();
  const setGrades = useSetSearchGrades();

  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={grades}
        onChange={value => setGrades(value.map(Number))}
      >
        <HStack spacing={4}>
          {[1, 2, 3, 4].map(grade => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});
