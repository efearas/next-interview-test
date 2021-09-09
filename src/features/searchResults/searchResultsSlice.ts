import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchSearchResults } from './searchResultsAPI';
import { EnumSearchType, ISearchParams } from '../searchForm/SearchForm'

export interface ISearchResult {
    title: string;
    linkUrl: string;
    text: string;
}

export interface ISearchAsyncFuncParams {
    searchType: EnumSearchType,
    searchParams: ISearchParams,
    isNewSearch: boolean,
}

export enum EnumSearchStatus {
    NeverSearched,
    Searching,
    SearchCompleted
}

export interface ISearchResultsState {
    searchResults: ISearchResult[];
    searchStatus: EnumSearchStatus;
}

const initialState: ISearchResultsState = {
    searchResults: [],
    searchStatus: EnumSearchStatus.NeverSearched,
};

const paramsToQueryString = (params: ISearchParams): string => {
    let queryString = 'attribute=' + params.attribute + '&';
    queryString += 'term=' + params.term + '&';
    queryString += 'entity=' + params.entity + '&';
    queryString += 'offset=' + params.offset;
    return encodeURI(queryString);
}

export const getSearchResults = createAsyncThunk(
    'searchResults/fetchSearchResults',
    async (searchAsyncFuncParams: ISearchAsyncFuncParams) => {
        const response = await fetchSearchResults(paramsToQueryString(searchAsyncFuncParams.searchParams));
        response.searchType = searchAsyncFuncParams.searchType;
        response.isNewSearch = searchAsyncFuncParams.isNewSearch;
        return response;

    }
)

export const searchResultsSlice = createSlice({
    name: 'searchResults',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getSearchResults.fulfilled, (state, action) => {
                state.searchStatus = EnumSearchStatus.SearchCompleted;
                state.searchResults = action.payload.isNewSearch ? [] : [...state.searchResults]                
                state.searchResults = [...state.searchResults, ...action.payload.results.map(
                    (result: any) => {
                        return {
                            title: getTitle(action.payload.searchType, result),
                            linkUrl: getLinkUrl(action.payload.searchType, result),
                            text: JSON.stringify(result),
                        }
                    }
                )]
            })
            .addCase(getSearchResults.pending, (state) => {
                state.searchStatus = EnumSearchStatus.Searching
            })
    }
})



const getLinkUrl = (searchType: EnumSearchType, result: any) => {
    if (searchType === EnumSearchType.artist) {
        return result.artistLinkUrl;
    }
    if (searchType === EnumSearchType.album || searchType === EnumSearchType.song) {
        return result.collectionViewUrl;
    }

}

const getTitle = (searchType: EnumSearchType, result: any) => {
    if (searchType === EnumSearchType.artist) {
        return result.artistName;
    }
    if (searchType === EnumSearchType.album) {
        return result.collectionName;
    }
    if (searchType === EnumSearchType.song) {
        return result.trackName;
    }
}

export const selectSearchResults = (state: RootState) => state.searchResults;

export default searchResultsSlice.reducer;