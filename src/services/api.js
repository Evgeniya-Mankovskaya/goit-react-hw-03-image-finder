export default function ImageApi(searchQuery, page) {
  const API_KEY = "24006610-770c029dafc5e505b4312f4f7";
  const BASE_URL = "https://pixabay.com/api/";
  const url = `${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

  return fetch(url);
}
