import { Input } from "antd";
import { useState } from "react";

const RbTableFilterNameInput = (props: any) => {
  const { defaultData, setFilteredData } = props;
  const [value, setValue] = useState("");

  return (
    <Input
      placeholder="Search name"
      value={value}
      onChange={(e) => {
        const currValue = e.target.value;
        setValue(currValue);
        const filteredData = defaultData.filter((item: any) =>
          item.name.toUpperCase().includes(currValue.toUpperCase())
        );
        setFilteredData(filteredData);
      }}
    />
  );
};

export default RbTableFilterNameInput;
