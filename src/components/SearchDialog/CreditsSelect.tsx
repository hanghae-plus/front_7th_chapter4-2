import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { memo } from "react";

interface CreditsSelectProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export const CreditsSelect = memo(({ value, onChange }: CreditsSelectProps) => {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">전체</option>
        <option value={1}>1학점</option>
        <option value={2}>2학점</option>
        <option value={3}>3학점</option>
      </Select>
    </FormControl>
  );
});

CreditsSelect.displayName = "CreditsSelect";
