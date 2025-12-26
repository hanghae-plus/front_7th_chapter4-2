import {
  useCallbackRef,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { ComponentProps, useState } from "react";
import { ScheduleItem } from "./ScheduleItem";
import { CSS } from "@dnd-kit/utilities";

type DraggableScheduleProps = ComponentProps<typeof ScheduleItem> & {
  onDeleteButtonClick: () => void;
};

export const DraggableSchedule = (props: DraggableScheduleProps) => {
  const { id, data, bg, onDeleteButtonClick } = props;

  const [enabledPopover, setEnabledPopover] = useState(false);
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
  const enablePopover = useCallbackRef(() => setEnabledPopover(true));

  const item = (
    <ScheduleItem
      bg={bg}
      data={data}
      ref={setNodeRef}
      transform={CSS.Translate.toString(transform)}
      onMouseEnter={enablePopover}
      {...listeners}
      {...attributes}
    />
  );

  if (!enabledPopover) {
    return item;
  }

  return (
    <Popover isLazy>
      <PopoverTrigger>{item}</PopoverTrigger>
      <PopoverContent onClick={(event) => event.stopPropagation()}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text>강의를 삭제하시겠습니까?</Text>
          <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
