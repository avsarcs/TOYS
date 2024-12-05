import React, { useState } from "react";
import { Modal, Button, Textarea} from "@mantine/core";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    title: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onSubmit,
                                                               title,
                                                           }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        onSubmit(reason); // Pass the reason to the parent
        setReason(""); // Clear the input
        onClose(); // Close the modal
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
        >
            <Textarea
                placeholder="Please explain your application."
                label="Reason for Application"
                autosize
                minRows={3}
                value={reason}
                onChange={(e) => setReason(e.currentTarget.value)}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <Button color="red" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="violet" onClick={handleSubmit} disabled={!reason.trim()}>
                    ➤ Send Application
                </Button>
            </div>
        </Modal>
    );
};

export default ApplicationModal;
