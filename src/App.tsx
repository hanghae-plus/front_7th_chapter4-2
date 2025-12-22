import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./ScheduleContext.tsx";
import { ScheduleTables } from "./ScheduleTables.tsx";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import theme from "./theme.ts";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <ScheduleTables />
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
