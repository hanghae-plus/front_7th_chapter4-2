import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./components/ScheduleContext.tsx";
import { ScheduleTables } from "./components/ScheduleTables.tsx";
import ScheduleDndProvider from "./components/ScheduleDndProvider.tsx";

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <ScheduleTables />
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
