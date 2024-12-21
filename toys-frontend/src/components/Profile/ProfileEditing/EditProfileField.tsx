import React from "react";
import { TextInput } from "@mantine/core";

interface EditProfileFieldProps {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    editable?: boolean;
}

const EditProfileField: React.FC<EditProfileFieldProps> = ({ label, value, onChange, editable }) => {
    return (
        <TextInput
            label={label}
            value={value}
            onChange={(e) => onChange && onChange(e.currentTarget.value)}
            disabled={!editable}
            placeholder={`Enter ${label.toLowerCase()}`}
            required
            className="mb-4"
        />
    );
};

export default EditProfileField;
