import "./TreeItem.style.css";

import { Box, ListItem, Text } from "@chakra-ui/react";
import React, { forwardRef, HTMLAttributes } from "react";
import { BsChevronRight } from "react-icons/bs";

import { TreeItemAction } from "./tree-components/TreeItemAction";
import { TreeItemHandle } from "./tree-components/TreeItemHandle";
import { TreeItemRemove } from "./tree-components/TreeItemRemove";

export interface TreeItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string | number;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref,
  ) => {
    return (
      <ListItem
        ref={wrapperRef}
        mb="-1px"
        pl={`${indentationWidth * depth}px`}
        listStyleType="none"
        boxSizing="border-box"
        className={`tree_item_wrapper 
            ${clone ? "tree_item_clone" : ""} 
            ${ghost ? "tree_item_ghost" : ""}
            ${indicator ? "tree_item_indicator" : ""}
            ${disableSelection ? "tree_item_disableSelection" : ""},
            ${disableInteraction ? "tree_item_disableInteraction" : ""}`}
        {...props}
      >
        <Box className="treeItem" ref={ref} style={style}>
          <TreeItemHandle {...handleProps} />
          {onCollapse && (
            <TreeItemAction
              onClick={onCollapse}
              className={`
                tree_item_collapse
                ${collapsed ? "tree_item_collapsed" : ""}`}
            >
              <BsChevronRight
                style={{
                  transform: `${collapsed ? "rotate(0deg)" : "rotate(90deg)"}`,
                }}
              />
            </TreeItemAction>
          )}
          <Text as="span" 
                className="tree_item_text" 
                pl={2} 
                flexGrow={1} 
                whiteSpace="nowrap" 
                textOverflow="ellipsis" 
                overflow="hidden">
            {value}
          </Text>
          {!clone && onRemove && <TreeItemRemove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <Text as="span" className="tree_item_count">
              {childCount}
            </Text>
          ) : null}
        </Box>
      </ListItem>
    );
  },
);

export default TreeItem;
