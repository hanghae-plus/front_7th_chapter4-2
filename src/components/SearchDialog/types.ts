import { SearchInfo } from "../../types";

export interface SearchDialogProps {
  searchInfo: SearchInfo | null;
  onDialogClose: () => void;
}
