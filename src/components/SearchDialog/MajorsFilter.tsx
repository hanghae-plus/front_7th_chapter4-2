import {
  CheckboxGroup,
  FormControl,
  FormLabel,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import { memo } from "react";
import { MajorsCheckbox } from "./MajorCheckbox.tsx";

interface MajorsFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  allMajors: string[];
}

export const MajorsFilter = memo(
  ({ value, onChange, allMajors }: MajorsFilterProps) => {
    const handleRemoveMajor = (major: string) => {
      onChange(value.filter((v) => v !== major));
    };

    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={value}
          onChange={(values) => onChange(values as string[])}
        >
          <Wrap spacing={1} mb={2}>
            {value.map((major) => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split("<p>").pop()}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveMajor(major)} />
              </Tag>
            ))}
          </Wrap>

          <MajorsCheckbox majors={allMajors} />
        </CheckboxGroup>
      </FormControl>
    );
  }
);

MajorsFilter.displayName = "MajorsFilter";
