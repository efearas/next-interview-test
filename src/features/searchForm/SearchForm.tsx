import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getSearchResults,
  selectSearchResults,
  EnumSearchStatus,
  changeSearchText,
} from "../searchResults/searchResultsSlice";

export enum EnumSearchType {
  artist = 0,
  album = 1,
  song = 2,
}

const searchTypeArr: EnumSearchType[] = [
  EnumSearchType.artist,
  EnumSearchType.album,
  EnumSearchType.song,
];

export interface ISearchParams {
  entity: string;
  term: string;
  attribute: string;
  offset: number;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
    "& > div,button": {
      marginTop: "20px",
      minWidth: "200px",
    },
    "@media(min-width:768px)": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      maxWidth: "800px",
      justifyContent: "space-around",
      "& > div,button": {
        marginLeft: "20px",
      },
    },
  },
  wrapper: {
    padding: "10px",
  },
}));

const SearchForm = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const searchResultsState = useAppSelector(selectSearchResults);
  const gettingData = useRef(false);
  const offset = useRef(0);
  const [searchType, setSearchType] = useState<EnumSearchType>(
    EnumSearchType.artist
  );

  useEffect(() => {
    if (searchResultsState.searchStatus === EnumSearchStatus.SearchCompleted) {
      gettingData.current = false;
    }
  }, [searchResultsState.searchStatus]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchType(event.target.value as EnumSearchType);
  };

  const search = (isNewSearch: boolean = true) => {
    dispatch(getSearchResults(isNewSearch));
  };

  return (
    <div className={classes.wrapper}>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-search-type">Select search type</InputLabel>
        <Select
          labelId="select-search-type"
          id="select-search-type"
          value={searchResultsState.searchType}
          onChange={handleChange}
        >
          {searchTypeArr.map((value) => (
            <MenuItem key={value} value={value}>
              {EnumSearchType[value]}
            </MenuItem>
          ))}
        </Select>
        <TextField
          id="standard-basic"
          label={`${EnumSearchType[searchType]} name`}
          value={searchResultsState.searchText}
          onChange={(e) => dispatch(changeSearchText(e.target.value))}
          inputProps={{
            "data-testid": "search-term",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            offset.current = 0;
            search(true);
          }}
          disabled={searchResultsState.searchText.trim().length === 0}
          data-testid="search-button"
        >
          Primary
        </Button>
      </FormControl>
    </div>
  );
};

export default SearchForm;
