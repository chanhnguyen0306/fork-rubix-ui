import React, { useEffect, useRef, useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  Connection,
  Handle,
  Position,
  useReactFlow,
} from "react-flow-renderer/nocss";
import cx from "classnames";
import { colors, valueTypeColorMap } from "../util/colors";
import { isValidConnection } from "../util/isValidConnection";
import { AutoSizeInput } from "./AutoSizeInput";
import { InputSocketSpecJSON } from "../lib";

export type InputSocketProps = {
  connected: boolean;
  value: any | undefined;
  minWidth: number;
  onChange: (key: string, value: any) => void;
  onSetWidthInput: (width: number) => void;
} & InputSocketSpecJSON;

const REGEX_NUMBER = new RegExp("^$|^-?(\\d+)?(\\.?\\d*)?$");

const getValueOptions = (value: number) => {
  switch (value) {
    case 0:
      return true;
    case 1:
      return false;
    case 2:
      return null;
    default:
      return false;
  }
};

const getNumberOptions = (value: boolean) => {
  switch (value) {
    case true:
      return 0;
    case false:
      return 1;
    case null:
      return 2;
    default:
      return 1;
  }
};

export const InputSocket = ({
  connected,
  value,
  onChange,
  name,
  valueType,
  minWidth,
  onSetWidthInput,
}: InputSocketProps) => {
  const instance = useReactFlow();
  const [inputNumber, setInputNumber] = useState(value || "");
  const refName = useRef<HTMLDivElement>(null);

  const showFlowIcon = valueType === "flow";
  const colorName = valueTypeColorMap[valueType];
  const [backgroundColor, borderColor] = colors[colorName];

  const onChangeInputNumber = (e: React.FormEvent<HTMLInputElement>) => {
    setInputNumber(e.currentTarget.value);
  };

  const onBlurInputNumber = (e: React.FormEvent<HTMLInputElement>) => {
    if (inputNumber.match(REGEX_NUMBER)) {
      onChange(name, Number(inputNumber));
    } else if (inputNumber === "null") {
      onChange(name, "null");
    } else {
      setInputNumber("0");
      onChange(name, 0);
    }
  };

  const onChangeCheckbox = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = getValueOptions(Number((e.target as HTMLInputElement).value));
    onChange(name, value);
  };

  useEffect(() => {
    if (refName.current) {
      const _width = refName.current.offsetWidth;
      onSetWidthInput(_width + 1);
    }
  }, [refName]);

  return (
    <div className="flex grow items-center justify-start h-7">
      {showFlowIcon && (
        <CaretRightOutlined style={{ color: "#ffffff", fontSize: "large" }} />
      )}
      {showFlowIcon === false && (
        <div style={{ display: "flex" }}>
          <div
            ref={refName}
            className="mr-2"
            style={{
              minWidth: minWidth === -1 ? "max-content" : minWidth,
            }}
          >
            {name}
          </div>
          {(connected === false || valueType === "boolean") && (
            <>
              {valueType === "string" && (
                <AutoSizeInput
                  type="text"
                  className="bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  value={value || ""}
                  onChange={(e) => onChange(name, e.currentTarget.value)}
                />
              )}
              {valueType === "number" && (
                <AutoSizeInput
                  type="text"
                  className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  value={inputNumber}
                  onChange={onChangeInputNumber}
                  onBlur={onBlurInputNumber}
                />
              )}
              {valueType === "boolean" && (
                <select
                  value={getNumberOptions(value)}
                  className="bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  onChange={onChangeCheckbox}
                  style={{ paddingRight: 18 }}
                >
                  <option value="0">true</option>
                  <option value="1">false</option>
                  <option value="2">null</option>
                </select>
              )}
            </>
          )}
        </div>
      )}
      <Handle
        id={name}
        type="target"
        position={Position.Left}
        className={cx(
          borderColor,
          connected ? backgroundColor : "bg-gray-1100"
        )}
        isValidConnection={(connection: Connection) =>
          isValidConnection(connection, instance)
        }
      />
    </div>
  );
};
