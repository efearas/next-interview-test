import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SearchForm from "./SearchForm";
import { Provider } from "react-redux";
import { store } from "../../app/store";

describe("SearchForm", () => {
  it("should handle empty search term textbox", async () => {
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
    const inputSearchTerm = screen.getByTestId("search-term");
    const buttonSearch = screen.getByTestId("search-button");
    expect(buttonSearch).toHaveAttribute("disabled");
    fireEvent.change(inputSearchTerm, {
      target: { value: "Micheal Jackson" },
    });
    expect(buttonSearch).not.toHaveAttribute("disabled");
  });

  it("snapshot test", () => {
    const { container } = render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
