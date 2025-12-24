import { useEffect, useState } from "react";
import { SearchInfo, SearchOptions } from "../types";
import { useCallbackRef } from "@chakra-ui/react";

interface UseSearchOptionProps {
  searchInfo: SearchInfo | null;
  onChange?: () => void;
}

export const useSearchOption = (props: UseSearchOptionProps) => {
  const { searchInfo, onChange } = props;

  const [values, setValues] = useState<SearchOptions>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const changeValue = <K extends keyof SearchOptions>(
    field: K,
    value: SearchOptions[K]
  ) => {
    setValues({ ...values, [field]: value });
    onChange?.();
  };

  const makeChangeFunction =
    <K extends keyof SearchOptions>(field: K) =>
    (value: SearchOptions[K]) =>
      changeValue(field, value);

  const changeQuery = useCallbackRef(makeChangeFunction("query" as const));
  const changeGrades = useCallbackRef(makeChangeFunction("grades" as const));
  const changeDays = useCallbackRef(makeChangeFunction("days" as const));
  const changeTimes = useCallbackRef(makeChangeFunction("times" as const));
  const changeMajors = useCallbackRef(makeChangeFunction("majors" as const));
  const changeCredits = useCallbackRef(makeChangeFunction("credits" as const));

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    onChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInfo]);

  return {
    values,
    query: { value: values.query, change: changeQuery },
    grades: { value: values.grades, change: changeGrades },
    days: { value: values.days, change: changeDays },
    times: { value: values.times, change: changeTimes },
    majors: { value: values.majors, change: changeMajors },
    credits: { value: values.credits, change: changeCredits },
  };
};
