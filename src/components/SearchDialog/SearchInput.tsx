import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { memo } from "react";

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
}

export const SearchInput = memo(({ value, onChange }: SearchInputProps) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
});

SearchInput.displayName = "SearchInput";
