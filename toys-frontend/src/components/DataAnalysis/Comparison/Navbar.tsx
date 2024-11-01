import React from 'react';

/**
 * Properties for the NavbarButton component.
 */
interface NavbarButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            data-layername={`tab${label.toLowerCase().replace(' ', '')}`}
            className={`z-10 flex-1 shrink px-16 pt-7 min-w-[240px] max-md:px-5 max-md:max-w-full ${
                isActive ? 'text-blue-600' : ''
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

interface NavbarProps {
    buttons: Array<{
        label: string;
        isActive: boolean;
        onClick: () => void;
    }>;
}

const Navbar: React.FC<NavbarProps> = ({ buttons }) => {
    return (
        <nav data-layername="tabBarIPhone" className="flex flex-col text-xl text-center text-zinc-700">
            <div data-layername="chromeMaterial" className="flex overflow-hidden flex-col w-full bg-cyan-400 border-t-0 border-black border-opacity-30 max-md:max-w-full">
                <div data-layername="chrome" className="flex flex-col items-center w-full bg-white bg-opacity-80 max-md:max-w-full">
                    <div data-layername="tabBarButtons" className="flex flex-wrap justify-between items-start w-full max-md:max-w-full">
                        {buttons.map((button, index) => (
                            <NavbarButton
                                key={index}
                                label={button.label}
                                isActive={button.isActive}
                                onClick={button.onClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

interface NavbarContainerProps {
    activeIndex: number;
};

const NavbarContainer: React.FC<NavbarContainerProps> = ({activeIndex}) => {
    const buttons = [
        { label: 'All Universities', isActive: (activeIndex === 0), onClick: () => {} },
        { label: 'Competitors', isActive: (activeIndex === 1), onClick: () => {} },
        { label: 'Comparison', isActive: (activeIndex === 2), onClick: () => {} }
    ];

    return <Navbar buttons={buttons} />;
};

export default NavbarContainer;