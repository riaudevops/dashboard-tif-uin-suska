export interface ContributorListItemProps {
	image: string;
	name: string;
	roles: string;
	socialProfiles?: {
		github?: string;
		linkedIn?: string;
		instagram?: string;
	};
}