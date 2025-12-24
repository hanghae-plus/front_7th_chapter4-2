import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from '@chakra-ui/react';
import { memo, useCallback, useEffect, useState } from 'react';

export const DayControl = memo(
  ({
    allDays,
    initialValue,
    onChange,
  }: {
    allDays: Readonly<string[]>;
    initialValue?: string[];
    onChange: (days: string[]) => void;
  }) => {
    const [days, setDays] = useState<string[]>(initialValue ?? []);

    const handleChange = useCallback(
      (value: string[]) => {
        setDays(value);
        onChange(value);
      },
      [onChange],
    );

    useEffect(() => {
      if (initialValue) {
        onChange(initialValue);
      }
    }, [onChange, initialValue]);

    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup value={days} onChange={(value) => handleChange(value as string[])}>
          <HStack spacing={4}>
            {allDays.map((day) => (
              <Checkbox key={day} value={day}>
                {day}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  },
);
