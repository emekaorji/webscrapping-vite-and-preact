// Hooks and Modules
import { useState, useEffect, useCallback } from 'preact/hooks';
import useDidUpdateEffect from './hooks/useDidUpdateEffect';

// Components
import SearchForm from './components/searchForm';
import SearchResults from './components/searchResults';

// Functions
import { loadData, loadMoreData } from './assets/js/dataFetcher';
import Footer from './components/footer';

export function App() {
	const [searchQuery, setSearchQuery] = useState('');
	const [pageQuery, setPageQuery] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resultCount, setResultCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	useDidUpdateEffect(async () => {
		await loadData(searchQuery, setSearchResult, setResultCount);
		setIsSubmitting(false);
	}, [searchQuery]);

	useDidUpdateEffect(async () => {
		setIsLoadingMore(true);
		await loadMoreData(pageQuery, setSearchResult, currentPage, setCurrentPage);
		setIsLoadingMore(false);
	}, [pageQuery]);

	const scrollFunction = useCallback(() => {
		const app = document.getElementById('app');
		const isBottomOfPage =
			window.innerHeight + window.scrollY >= app.scrollHeight - 3400;
		if (isBottomOfPage) {
			setPageQuery((pageQuery) => ({
				...pageQuery,
				...searchQuery,
				pageNumber: currentPage + 1,
			}));
			window.removeEventListener('scroll', scrollFunction);
		}
	}, [currentPage, searchQuery]);

	useEffect(() => {
		const unsubscribe = () => {
			if (searchResult.length >= resultCount) return;
			window.addEventListener('scroll', scrollFunction);
		};

		return unsubscribe();
	}, [currentPage, searchResult, resultCount]);

	return (
		<>
			<main>
				<SearchForm
					isSubmitting={isSubmitting}
					setIsSubmitting={setIsSubmitting}
					setSearchQuery={setSearchQuery}
				/>
				<SearchResults
					searchResult={searchResult}
					isLoadingMore={isLoadingMore}
				/>
			</main>
			<Footer />
		</>
	);
}
