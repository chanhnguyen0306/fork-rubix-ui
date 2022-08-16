import { useEffect, useState } from "react";

interface DialogState {
  [name: string]: boolean;
}

interface DialogData {
  [state: string]: any;
}

export const useDialogs = (dialogNames?: string[]) => {
  let [dialogState, updateDialogState] = useState({} as DialogState);
  let [dialogData, updateDialogData] = useState({} as DialogData);

  useEffect(() => {
    Array.isArray(dialogNames) &&
      dialogNames.forEach((dialogName: string) => {
        closeDialog(dialogName);
      });
  }, []);

  const closeDialog = (dialogName: string) => {
    updateDialogState({ ...dialogState, [dialogName]: false });
    updateDialogData({ ...dialogData, [dialogName]: null });
  };

  const openDialog = (dialogName: string, dialogData: any) => {
    updateDialogState({ ...dialogState, [dialogName]: true });
    updateDialogData({ ...dialogState, [dialogName]: dialogData });
  };

  const isOpen = (dialogName: string) => {
    return dialogState.hasOwnProperty(dialogName)
      ? dialogState[dialogName]
      : false;
  };

  return { openDialog, closeDialog, isOpen, dialogData };
};
