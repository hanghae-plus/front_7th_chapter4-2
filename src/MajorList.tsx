import React from "react";
import { Box, Checkbox } from "@chakra-ui/react";

export const MajorList = React.memo(({ allMajors }: { allMajors: string[] }) => {
  return (
    allMajors &&
    allMajors.length > 0 &&
    allMajors.map((major) => (
      <Box key={major}>
        <Checkbox key={major} size='sm' value={major}>
          {major.replace(/<p>/gi, " ")}
        </Checkbox>
      </Box>
    ))
  );
});
