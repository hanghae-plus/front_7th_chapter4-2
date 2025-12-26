import { memo } from "react"
import { FormControl, FormLabel, Input } from "@chakra-ui/react"

interface Props {
  value?: string
  onChange: (value: string) => void
}

export const SearchQueryField = memo(({ value, onChange }: Props) => (
  <FormControl>
    <FormLabel>검색어</FormLabel>
    <Input
      placeholder="과목명 또는 과목코드"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </FormControl>
))
