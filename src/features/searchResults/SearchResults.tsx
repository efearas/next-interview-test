import { useAppSelector } from "../../app/hooks";
import { EnumSearchStatus, selectSearchResults } from "./searchResultsSlice";
import styled from "styled-components";

const Wrapper = styled.div`

margin-top: 20px;
@media(min-width:768px){
  margin-top: 50px;
  margin-left: 50px;
}
`
const ResultLine = styled.div`
margin-bottom: 50px;
`

const SearchResults = () => {
  const searchResultsState = useAppSelector(selectSearchResults);


  return (
    <Wrapper>
      {searchResultsState.searchResults.length > 0 &&
        searchResultsState.searchResults.map((searchResult) => (
          <ResultLine key={searchResult.linkUrl}>
            <div>
              <a href={searchResult.linkUrl}>{searchResult.title}</a>
            </div>
            <div>{searchResult.text.substring(0, window.innerWidth < 768 ? 50 : 150)}...</div>
          </ResultLine>
        ))}
      {searchResultsState.searchStatus === EnumSearchStatus.SearchCompleted &&
        searchResultsState.searchResults.length === 0 && (
          <div>No search result. Try searching with different values.</div>
        )}
    </Wrapper>
  );
};

export default SearchResults;
