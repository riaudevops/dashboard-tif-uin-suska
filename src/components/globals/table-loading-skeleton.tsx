import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type TableLoadingSkeletonProps = {
	rows?: number;
	columns?: number;
	className?: string;
};

const TableLoadingSkeleton: React.FC<TableLoadingSkeletonProps> = ({
	rows = 7,
	columns = 7,
	className = "px-1 h-6 w-full",
}) => {
	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<TableRow key={rowIndex}>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<TableCell key={colIndex} className="px-1">
							<Skeleton className={className} />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
};

export default TableLoadingSkeleton;
