import { memo } from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

interface CreditsFilterProps {
  value?: number;
  onChange: (value: string) => void;
}

const CreditsFilter = memo(({ value, onChange }: CreditsFilterProps) => {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
});

export default CreditsFilter;
