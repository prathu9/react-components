import {
  Button,
  EmptyStateActions,
  EmptyStateContainer,
  EmptyStateContainerProps,
  EmptyStateDescription,
} from "@saas-ui/react";
import * as React from "react";

import { useDataGridContext } from "./data-grid";

export interface NoResultsProps
  extends Omit<EmptyStateContainerProps, "title"> {
  title?: string;
  resource?: string;
  clearLabel?: string;
  onReset?(): void;
}

export const NoResults: React.FC<NoResultsProps> = (props) => {
  const { state } = useDataGridContext();

  const count = state.columnFilters.length || "your";

  const {
    resource = "results",
    title = state.globalFilter
      ? `No ${resource} found for "${state.globalFilter}"`
      : `No ${resource} matching ${count} filters.`,
    clearLabel = "Clear filters",
    onReset,
    ...rest
  } = props;

  return (
    <EmptyStateContainer variant="no-results" {...rest}>
      <EmptyStateDescription>{title}</EmptyStateDescription>
      {!!state.columnFilters.length && (
        <EmptyStateActions>
          <Button
            onClick={onReset}
            label={clearLabel}
            variant="ghost"
            size="xs"
          />
        </EmptyStateActions>
      )}
    </EmptyStateContainer>
  );
};
