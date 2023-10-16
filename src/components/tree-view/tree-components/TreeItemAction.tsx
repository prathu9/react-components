import { Button } from "@chakra-ui/react";
import React, { CSSProperties, forwardRef } from "react";

export interface TreeItemActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties["cursor"];
}

export const TreeItemAction = forwardRef<HTMLButtonElement, TreeItemActionProps>(
  ({ active, className, cursor, style, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        className={`${className} tree_item_action`}
        tabIndex={0}
        w="10px"
        p="15px"
        alignItems="center"
        style={
          {
            ...style,
            cursor,
            "--fill": active?.fill,
            "--background": active?.background,
          } as CSSProperties
        }
      />
    );
  },
);
