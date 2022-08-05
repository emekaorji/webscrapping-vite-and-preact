import getScrapedJobs from './webScraper';

const loadData = async (searchQuery, setSearchResult, setResultCount) => {
	const { results, numberOfResults } = await getScrapedJobs(searchQuery);

	setSearchResult(results);
	setResultCount(numberOfResults);
};

const loadMoreData = async (
	pageQuery,
	setSearchResult,
	currentPage,
	setCurrentPage
) => {
	const { results } = await getScrapedJobs(pageQuery);

	setSearchResult((prevResult) => prevResult.concat(results));
	setCurrentPage(currentPage + 1);
};

export { loadData, loadMoreData };
