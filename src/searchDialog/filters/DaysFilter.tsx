import { memo } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { useSearchDays, useSetSearchDays } from '../../SearchOptionsContext';
import { DAY_LABELS } from '../../constants';

export const DaysFilter = memo(() => {
  const days = useSearchDays();
  const setDays = useSetSearchDays();

  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={days}
        onChange={value => setDays(value as string[])}
      >
        <HStack spacing={4}>
          {DAY_LABELS.map(day => (
            <Checkbox key={day} value={day}>
              {day}
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});
