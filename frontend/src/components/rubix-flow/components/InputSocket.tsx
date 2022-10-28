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
  dataInput: any;
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

const handleConvertInputNumber = (_value: any) => {
  if (_value === null) return "null";
  else  if (!_value && _value !== 0) return "";
  return _value.toString();
};

export const InputSocket = ({
                              connected,
                              value,
                              onChange,
                              name,
                              valueType,
                              minWidth,
                              onSetWidthInput,
                              dataInput,
                            }: InputSocketProps) => {
  const instance = useReactFlow();
  const [inputNumber, setInputNumber] = useState(handleConvertInputNumber(value));
  const refName = useRef<HTMLDivElement>(null);

  const showFlowIcon = valueType === "flow";
  const colorName = valueTypeColorMap[valueType];
  const [backgroundColor, borderColor] = colors[colorName];

  const handleChangeInput = (value: string) => onChange(name, value);

  const onChangeInputNumber = (value: string) => {
    setInputNumber(value);
  };

  const onBlurInputNumber = (e: React.FormEvent<HTMLInputElement>) => {
    if (inputNumber.match(REGEX_NUMBER)) {
      onChange(name, Number(inputNumber));
    } else if (inputNumber === "null") {
      onChange(name, null);
    } else {
      setInputNumber("0");
      onChange(name, 0);
    }
  };

  const onChangeCheckbox = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = getValueOptions(Number((e.target as HTMLInputElement).value));
    onChange(name, value);
  };

  const getDataByConnected = (valueCurrent: number | string | boolean) => {
    if (!connected) return valueCurrent;
    if (!dataInput) return valueType === "boolean" ? 1 : "";

    const input = dataInput.find((item: { pin: string }) => item.pin === name);

    return valueType === "boolean" ? getNumberOptions(value) : input.value;
  };

  const findBooleanValueInput = () => {
    let value = dataInput && dataInput.find((item: { pin: string }) => item.pin === name).value;
    if (value === null) value = "null";
    
    return value || "";
  }

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
          <div>
            {valueType === "string" && (
              <AutoSizeInput
                type="text"
                className="bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                value={getDataByConnected(value || "")}
                onChangeInput={handleChangeInput}
              />
            )}
            {valueType === "number" && (
              <AutoSizeInput
                type="text"
                className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                value={getDataByConnected(inputNumber)}
                onChangeInput={onChangeInputNumber}
                onBlur={onBlurInputNumber}
              />
            )}
            {valueType === "boolean" &&
              (connected ? (
                <AutoSizeInput
                  type="text"
                  className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  value={findBooleanValueInput()}
                  disabled
                />
              ) : (
                <select
                  value={getDataByConnected(getNumberOptions(value))}
                  className="bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  onChange={onChangeCheckbox}
                  style={{ paddingRight: 18 }}
                >
                  <option value="0">true</option>
                  <option value="1">false</option>
                  <option value="2">null</option>
                </select>
              ))}
          </div>
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
