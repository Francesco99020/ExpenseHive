import React from 'react';

interface SidePanelButtonProps {
    name: string;
    isSelected: boolean;
    onClick: () => void;
}

const SidePanelButton: React.FC<SidePanelButtonProps> = ({ name, isSelected, onClick }) => {
    return (
        <button
            className={`w-full h-14 font-bold flex justify-center items-center relative
            ${isSelected ? 'bg-[#ffbe42]' : 'bg-dark-yellow'} text-[#cc5d00]`}
            onClick={onClick}
        >
            {name}
        </button>
    );
};

export default SidePanelButton;
