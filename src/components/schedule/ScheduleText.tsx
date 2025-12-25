import { Text } from '@chakra-ui/react';
import { memo } from 'react';

interface ScheduleTextProps {
  title: string;
  room?: string;
}

const ScheduleText = memo(({ title, room }: ScheduleTextProps) => {
  return (
    <>
      <Text fontSize="sm" fontWeight="bold">
        {title}
      </Text>
      {room && <Text fontSize="xs">{room}</Text>}
    </>
  );
});

export default ScheduleText;
