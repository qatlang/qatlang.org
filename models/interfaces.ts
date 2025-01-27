export interface ILanguageRelease {
	id: string;
	releaseID: string;
	version: {
		value: string;
		isPrerelease: boolean;
		prerelease: string;
	};
	title: string;
	content: string;
	files: {
		id: string;
		name: string;
		downloads: number;
		platform: string;
		architecture: string;
		size: string;
		target: string;
		path: string;
	}[];
	index: number;
	createdAt: string;
}

export interface ILanguagePublicRelease {
	version: {
		value: string;
		isPrerelease: boolean;
		prerelease: string;
	};
	title: string;
	content: string;
	files: {
		platform: string;
		target: string;
		path: string;
	}[];
	createdAt: string;
}

export interface ILanguageExample {
	title: string;
	content: string;
}

export interface IProjectStats {
	data: {
		decimal: string;
		digital: string;
		is_up_to_date: boolean;
		percent_calculated: number;
		project: string;
		range: {
			end: string;
			end_date: string;
			end_text: string;
			start: string;
			start_date: string;
			start_text: string;
			timezone: string;
		};
		text: string;
		timeout: number;
		total_seconds: number;
	};
}

export interface ITimeStats {
	compiler: IProjectStats;
	website: IProjectStats;
	server: IProjectStats;
	vscode: IProjectStats;
	docs: IProjectStats;
	tom: IProjectStats;
}

export interface IGitlabPushEvent {
	object_kind: string;
	event_name: string;
	before: string;
	after: string;
	ref: string;
	checkout_sha: string;
	user_id: number;
	user_name: string;
	user_username: string;
	user_email: string;
	user_avatar: string;
	project_id: number;
	project: {
		id: number;
		name: string;
		description: string;
		web_url: string;
		avatar_url: null;
		git_ssh_url: string;
		git_http_url: string;
		namespace: string;
		visibility_level: number;
		path_with_namespace: string;
		default_branch: string;
		homepage: string;
		url: string;
		ssh_url: string;
		http_url: string;
	};
	repository: {
		name: string;
		url: string;
		description: string;
		homepage: string;
		git_http_url: string;
		git_ssh_url: string;
		visibility_level: number;
	};
	commits: {
		id: string;
		message: string;
		title: string;
		timestamp: string;
		url: string;
		author: {
			name: string;
			email: string;
		};
		added: string[];
		modified: string[];
		removed: string[];
	}[];
	total_commits_count: number;
}

export interface IGithubCommit {
	author: {
		date?: string;
		email: string;
		name: string;
		username?: string;
	};
	committer: {
		date?: string;
		email: string;
		name: string;
		username?: string;
	};
	distinct: boolean;
	id: string;
	message: string;
	added?: string[];
	modified?: string[];
	removed?: string[];
	timestamp: string;
	tree_id: string;
	url: string;
}

export interface IGithubPushEvent {
	after: string;
	base_ref: string | null;
	before: string;
	commits: IGithubCommit[];
	compare: string;
	created: boolean;
	deleted: string;
	forced: boolean;
	head_commit: IGithubCommit | null;
	installation: any;
	organisation: any;
	pusher: {
		date?: string;
		email?: string | null;
		name: string;
		username?: string;
	};
	ref: string;
	repository: { full_name: string; private: boolean; html_url: string };
	sender?: any;
}

export interface ICommit {
	commitID: string;
	title: string;
	message: string;
	author: {
		name: string;
		email?: string;
	};
	repository: string;
	site: "github" | "gitlab" | "custom";
	timestamp: string;
	ref: string;
}

export interface IPost {
	collectionId: string;
	id: string;
	slug?: string;
	title: string;
	content: string;
	timestamp: string;
	source: string;
	images: string[];
}

export interface Position {
	line: number;
	char: number;
}

export interface FileRange {
	file: string;
	start: Position;
	end: Position;
}

export interface Problem {
	isError: boolean;
	message: string;
	hasRange: boolean;
	fileRange?: FileRange;
}

export interface CompileResult {
	problems: Problem[];
	hasMain: boolean;
	status: boolean;
	compilationTime: number;
	linkingTime: number;
	binarySizes: number[];
}

export interface CompileStatus {
	result: CompileResult;
	output: string;
	statusCode?: number;
	prematureKill: boolean;
	overflowedOutput: boolean;
}
