import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { memo } from "react";

interface Props {
    query: string | undefined;
    searchTitleOrCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ query, searchTitleOrCode }: Props) => {
    return (
        <FormControl>
            <FormLabel>검색어</FormLabel>
            <Input
                placeholder="과목명 또는 과목코드"
                value={query}
                onChange={searchTitleOrCode}
            />
        </FormControl>
    );
};

export default memo(SearchInput);