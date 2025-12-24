import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { memo, useState } from 'react';

export const CreditControl = memo(
  ({
    allCredits,
    onChange,
  }: {
    allCredits: Readonly<{ id: string; label: string }[]>;
    onChange: (value: number) => void;
  }) => {
    const [credits, setCredits] = useState<number | undefined>();

    const handleChange = (value: number) => {
      setCredits(value);
      onChange(value);
    };

    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select value={credits} onChange={(e) => handleChange(Number(e.target.value))}>
          {allCredits.map((credit: { id: string; label: string }) => (
            <option key={credit.id} value={credit.id}>
              {credit.label}
            </option>
          ))}
        </Select>
      </FormControl>
    );
  },
);
