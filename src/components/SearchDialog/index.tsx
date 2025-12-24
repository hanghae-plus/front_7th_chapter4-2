import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { SearchItem } from "./SearchItem.tsx";
import {
  useAddSchedule,
  useInfiniteLectures,
  useLectures,
  useSearchOption,
} from "../../hooks";
import { SearchDialogProps } from "./types.ts";
import { SearchInput } from "./SearchInput.tsx";
import { CreditsSelect } from "./CreditsSelect.tsx";
import { GradesCheckbox } from "./GradesCheckbox.tsx";
import { DaysCheckbox } from "./DaysCheckbox.tsx";
import { TimesCheckbox } from "./TimesCheckbox.tsx";
import { MajorsFilter } from "./MajorsFilter.tsx";

export const SearchDialog = (props: SearchDialogProps) => {
  const { searchInfo, onDialogClose } = props;

  const searchOptions = useSearchOption({
    searchInfo,
    onChange: () => infiniteLectures.reset(),
  });
  const lectures = useLectures({ searchOptions: searchOptions.values });
  const infiniteLectures = useInfiniteLectures({ items: lectures.items });
  const addSchedule = useAddSchedule({
    tableId: searchInfo?.tableId,
    onComplete: onDialogClose,
  });

  if (!searchInfo) {
    return null;
  }

  return (
    <Modal isOpen onClose={onDialogClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchInput
                value={searchOptions.query.value}
                onChange={searchOptions.query.change}
              />
              <CreditsSelect
                value={searchOptions.credits.value}
                onChange={searchOptions.credits.change}
              />
            </HStack>

            <HStack spacing={4}>
              <GradesCheckbox
                value={searchOptions.grades.value}
                onChange={searchOptions.grades.change}
              />
              <DaysCheckbox
                value={searchOptions.days.value}
                onChange={searchOptions.days.change}
              />
            </HStack>

            <HStack spacing={4}>
              <TimesCheckbox
                value={searchOptions.times.value}
                onChange={searchOptions.times.change}
              />
              <MajorsFilter
                value={searchOptions.majors.value}
                onChange={searchOptions.majors.change}
                allMajors={lectures.allMajors}
              />
            </HStack>

            <Text align="right">검색결과: {lectures.items.length}개</Text>
            <Box>
              <Table>
                <Thead>
                  <Tr>
                    <Th width="100px">과목코드</Th>
                    <Th width="50px">학년</Th>
                    <Th width="200px">과목명</Th>
                    <Th width="50px">학점</Th>
                    <Th width="150px">전공</Th>
                    <Th width="150px">시간</Th>
                    <Th width="80px"></Th>
                  </Tr>
                </Thead>
              </Table>

              <Box
                overflowY="auto"
                maxH="500px"
                ref={infiniteLectures.wrapperRef}
                sx={{
                  fontSize: "sm",
                  "& td": { px: 4, py: 2 },
                  "& button": {
                    transition: "0.15s",
                    fontSize: "sm",
                    bg: "green.500",
                    color: "white",
                    px: 4,
                    py: 2,
                    borderRadius: "md",
                    _hover: { bg: "green.600" },
                  },
                }}
              >
                <Table size="sm" variant="striped">
                  <Tbody>
                    {infiniteLectures.items.map((lecture, index) => (
                      <SearchItem
                        key={`${lecture.id}-${index}`}
                        lecture={lecture}
                        addSchedule={addSchedule}
                      />
                    ))}
                  </Tbody>
                </Table>
                <Box ref={infiniteLectures.ref} h="20px" />
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
