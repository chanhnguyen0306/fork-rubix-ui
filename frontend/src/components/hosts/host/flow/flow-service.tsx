import { SELECTED_ITEMS } from "../../../rubix-flow/use-nodes-spec";

//for mass edit
export const setDataLocalStorage = (list: any) => {
  const selectedItems = JSON.parse("" + localStorage.getItem(SELECTED_ITEMS));
  if (!selectedItems || selectedItems.length === 0) return;

  const newSelectedItems = [] as any[];
  selectedItems.forEach((storedItem: any) => {
    const updatingItem = list.find(
      (item: any) => item.uuid === storedItem.uuid
    );
    if (updatingItem) newSelectedItems.push(updatingItem);
  });
  localStorage.setItem(SELECTED_ITEMS, JSON.stringify(newSelectedItems));
};
