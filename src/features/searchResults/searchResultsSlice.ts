import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchSearchResults } from './searchResultsAPI';
import { ISearchParams } from '../searchForm/SearchForm'

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

enum EnumSearchType {
    artist = 0,
    album = 1,
    song = 2,
}

//type TSearchType = 'artist' | 'album' | 'song'

export interface ISearchResultsState {
    searchResults: ISearchResult[];
    searchStatus: EnumSearchStatus;
    searchType: EnumSearchType;
    searchText: string;
    offset: number;
}

const initialState: ISearchResultsState = {
    searchResults: [],
    searchStatus: EnumSearchStatus.NeverSearched,
    searchType: EnumSearchType.album,
    searchText: '',
    offset: 0,

};


const attributeValues = {
    [EnumSearchType.artist]: "artistTerm",
    [EnumSearchType.album]: "albumTerm",
    [EnumSearchType.song]: "songTerm",
};

const entityValues = {
    [EnumSearchType.artist]: "allArtist",
    [EnumSearchType.album]: "album",
    [EnumSearchType.song]: "song",
};


const paramsToQueryString = (state: ISearchResultsState): string => {
    let queryString = 'attribute=' + attributeValues[state.searchType] + '&';
    queryString += 'term=' + state.searchText + '&';
    queryString += 'entity=' + entityValues[state.searchType] + '&';
    queryString += 'offset=' + state.offset;
    return encodeURI(queryString);
}

export const getSearchResults = createAsyncThunk(
    'searchResults/fetchSearchResults',
    async (isNewSearch: boolean, { getState }) => {
        const globalState: any = getState();
        const state = globalState.searchResults as ISearchResultsState;
        const response = await fetchSearchResults(paramsToQueryString(state));
        response.searchType = state.searchType;
        response.isNewSearch = isNewSearch;
        return response;

    }
)

export const searchResultsSlice = createSlice({
    name: 'searchResults',
    initialState,
    reducers: {
        changeSearchType: (state, action) => {
            state.searchType = action.payload
        },
        changeSearchText: (state, action: PayloadAction<string>) => {
            state.searchText = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSearchResults.fulfilled, (state, action) => {
                state.searchStatus = EnumSearchStatus.SearchCompleted;
                if (action.payload.results.length === 0) return
                state.searchResults = action.payload.isNewSearch ? [] : [...state.searchResults]
                state.searchResults = [...state.searchResults, ...action.payload.results.map(
                    (result: any) => {
                        return {
                            title: getTitle(action.payload.searchType, result),
                            linkUrl: getLinkUrl(action.payload.searchType, result),
                            text: JSON.stringify(result),
                        }
                    }
                )].reduce((acc, cur) => {
                    if (acc.findIndex((f: any) => f.linkUrl === cur.linkUrl) === -1)
                        acc.push(cur);
                    return acc;
                }, []);
                state.offset = state.searchResults.length;
            })
            .addCase(getSearchResults.pending, (state) => {
                state.searchStatus = EnumSearchStatus.Searching
            })
    }
})

export const { changeSearchText, changeSearchType } = searchResultsSlice.actions;

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