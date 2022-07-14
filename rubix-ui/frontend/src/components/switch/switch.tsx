
// @ts-ignore
import Dipswitch from "react-dipswitch";  // https://github.com/NubeIO/react-dipswitch
import {InputNumber} from "antd";
import {useState} from "react";

export const DipSwitch = () => {
    const [address, setAddress] = useState<any>();
    const onChange = (value: number) => {
        setAddress(value)
    };

    const onSwitchClick = (value: number) => {
        setAddress(value)

    };

    return (
        <>
            <p style={{ textAlign: 'left' }} >
                <div>
                    <InputNumber min={0} max={128} defaultValue={1} onChange={onChange} />
                    <Dipswitch
                        switchCount={7}
                        value={address-1}
                        width={200}
                        // onValueChange={onSwitchClick}
                    />
                </div>
            </p>
        </>

    );
};


