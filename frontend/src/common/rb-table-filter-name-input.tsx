import { Input } from "antd";
import { useEffect, useState } from "react";

const RbTableFilterNameInput = (props: any) => {
  const { defaultData, setFilteredData } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    return setValue("");
  }, [defaultData.length]);

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
