interface ListFilters {
    isDeleted?: boolean
    includeDeleted?: boolean
}

export type GetAllUserData = ListFilters
export type GetAllUserMagicTokensData = ListFilters
export type GetAllPagesToTrackData = ListFilters
export type GetAllScheduledTrackingResultsData = ListFilters