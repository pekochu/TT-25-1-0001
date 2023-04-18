interface ListFilters {
    isDeleted?: boolean
    includeDeleted?: boolean
}

export type GetAllUserData = ListFilters
export type GetAllPagesToTrackData = ListFilters