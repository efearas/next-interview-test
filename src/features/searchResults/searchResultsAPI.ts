// A mock function to mimic making an async request for data
export function fetchSearchResults_eski(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

export function fetchSearchResults(queryParameters : string = "") {
  return fetch(
    `https://itunes.apple.com/search?limit=10&${queryParameters}`
  ).then((res) => res.json())
}



