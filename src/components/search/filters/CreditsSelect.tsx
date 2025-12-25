import { memo } from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

interface CreditsSelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

export const CreditsSelect = memo(({ value, onChange }: CreditsSelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    onChange(v ? Number(v) : undefined);
  };

  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={value ?? ''} onChange={handleChange}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
});

CreditsSelect.displayName = 'CreditsSelect';
