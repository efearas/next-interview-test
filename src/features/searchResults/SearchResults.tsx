import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  EnumSearchStatus,
  selectSearchResults,
  getSearchResults,
} from "./searchResultsSlice";
import styled from "styled-components";
import { useEffect, useRef } from "react";

const Wrapper = styled.div`
  margin-top: 20px;
  @media (min-width: 768px) {
    margin-top: 50px;
    margin-left: 50px;
  }
`;
const ResultLine = styled.div`
  margin-bottom: 50px;
`;

const SearchResults = () => {
  const searchResultsState = useAppSelector(selectSearchResults);
  const dispatch = useAppDispatch();
  const lastLineRef = useRef(null);
  const intersectingTarget = useRef(null);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(intersectHandler);
    if (lastLineRef && lastLineRef.current) {
      intersectionObserver.observe(lastLineRef.current!);
      //console.log("observer initialized");
    }
    /*return () => {
      intersectionObserver.disconnect();
    };*/
  }, [searchResultsState.searchResults]);

  const intersectHandler = (entries: any[]) => {
    if (
      entries[0]?.isIntersecting &&
      entries[0]?.target !== intersectingTarget.current
    ) {
      console.log("intersecting", entries[0]);
      intersectingTarget.current = entries[0].target;
      dispatch(getSearchResults(false));
    }
  };

  return (
    <Wrapper>
      {searchResultsState.searchResults.length > 0 &&
        searchResultsState.searchResults.map((searchResult, idx) => (
          <ResultLine
            key={searchResult.linkUrl}
            ref={
              idx === searchResultsState.searchResults.length - 1
                ? lastLineRef
                : null
            }
          >
            <div>
              <a href={searchResult.linkUrl}>{searchResult.title}</a>
            </div>
            <div>
              {searchResult.text.substring(
                0,
                window.innerWidth < 768 ? 50 : 150
              )}
              ...
            </div>
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
