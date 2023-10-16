import { useState, useEffect } from "react";

import { Menu, MenuList, MenuItem, Portal, MenuItemProps, PortalProps } from "@chakra-ui/react";
import { autoUpdate, flip, useFloating } from "@floating-ui/react-dom";
import {BsChevronRight} from "react-icons/bs";

type SubMenuPropsType = {
    label: string;
    children: JSX.Element | JSX.Element[],
    portalProps?: PortalProps,
    menuItemProps?: MenuItemProps
}

export const SubMenu = ({label, children, portalProps, menuItemProps}: SubMenuPropsType) => {
    const [isOpen, setIsOpen] = useState(false);  
    const [isDeferredOpen, setIsOpenDeferredOpen] = useState<boolean>(false);
    const {x, y, reference, floating, strategy} = useFloating({
        placement: "right-start",
        middleware: [flip()],
        whileElementsMounted: autoUpdate,
    });

    useEffect(()=>{
        if (isOpen) {
              setTimeout(() => {
                setIsOpenDeferredOpen(true);
              })
          } else {
            setIsOpenDeferredOpen(false);
          }
    }, [isOpen])

    return(
        <>
            <MenuItem
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onClick={() => setIsOpen(false)}
                ref={reference}
                {...menuItemProps}
                display="flex"
                justifyContent="space-between"
                bgColor={isOpen? "gray.100": ""}
            >
                {label}
                <BsChevronRight />
                {
                    isOpen && (
                        <Portal {...portalProps}>
                            <Menu isOpen={isDeferredOpen}>
                                <MenuList
                                    w="inherit"
                                    position={strategy}
                                    top={`${y}px`}
                                    left={`${x}px`}
                                    ref={floating}
                                >
                                    {children}
                                </MenuList>
                            </Menu>
                        </Portal>
                    )
                }
            </MenuItem>
        </>
    )
}