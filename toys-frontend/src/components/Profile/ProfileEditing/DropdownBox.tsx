import React from "react";
import { Select } from "@mantine/core";

interface DropdownBoxProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

const DropdownBox: React.FC<DropdownBoxProps> = ({ label, value, onChange, options }) => {
    return (
        <Select
            label={label}
            value={value}
            onChange={(value) => onChange(value!)}
            placeholder={`Select ${label.toLowerCase()}`}
            data={options}
            required
            className="mb-6"
        />
    );
};

export default DropdownBox;
