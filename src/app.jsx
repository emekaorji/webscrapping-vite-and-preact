import './app.css';
import cheerio from 'cheerio';
import axios from 'axios';
import { useState, useEffect } from 'preact/hooks';

async function getResults(job, location, pageNumber) {
	const { data } = await axios.get(
		`http://localhost:5173/api/search?page=${pageNumber}&search=${job}&location=${location}`
	);
	const $ = cheerio.load(data);

	let results = [];
	const jobsLength = $('#job-list li').length;
	for (let i = 0; i < jobsLength; i++) {
		results.push({});
	}

	$('#job-list li').each(function (i, _elem) {
		results[i].id = i + 1;
	});
	$('#job-list li .job-title').each(function (i, elem) {
		results[i].jobTitle = $(elem).text().trim();
	});
	$('#job-list li .job-age').each(function (i, elem) {
		results[i].jobAge = $(elem).text().trim();
	});
	$('#job-list li .job-tags').each(function (i, elem) {
		results[i].jobTags = {};
		$(elem)
			.children()
			.each(function (i2, elem2) {
				results[i].jobTags[`tag${i2}`] = $(elem2).text().trim();
			});
	});
	$('#job-list li .job-locations').each(function (i, elem) {
		results[i].jobLocation = $(elem).text().split('&')[0].trim();
	});
	$('#job-list li .job-description').each(function (i, elem) {
		results[i].jobDescription = $(elem).text().trim();
	});

	const numberOfResults = $('.job-category-jobs > div:first-of-type h4')
		?.text()
		.trim();

	return { results, numberOfResults };
}

async function getScrapedJobs(query) {
	if (!query || !query.job) return { results: null };
	const job = await query.job?.replace(' ', '+');
	const location = (await query.location?.replace(' ', '+')) || '';
	const pageNumber = (await query.pageNumber) || 1;

	const results = getResults(job, location, pageNumber);

	return results;
}

export function App() {
	const [searchResult, setSearchResult] = useState(null);
	const [jobValue, setJobValue] = useState('');
	const [locationValue, setLocationValue] = useState('');
	const [searchQuery, setSearchQuery] = useState(null);

	useEffect(async () => {
		console.log('fetching jobs...');

		const { results, numberOfResults } = await getScrapedJobs(searchQuery);
		setSearchResult(results);

		console.log('fetching jobs done!');
		console.log(results);
		console.log(numberOfResults);
	}, [searchQuery]);

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setSearchQuery({ job: jobValue, location: locationValue });
				}}>
				<input
					type='text'
					value={jobValue}
					onInput={(e) => setJobValue(e.target.value)}
					// placeholder='Job'
				/>
				{/* <input
					type='text'
					value={locationValue}
					onInput={(e) => setLocationValue(e.target.value)}
					// placeholder='Location'
				/> */}
			</form>
			{searchResult &&
				searchResult?.map((result) => (
					<ul>
						<li>Job Title: {result.jobTitle}</li>
						<li>Job Age: {result.jobAge}</li>
						<li>
							<span>Job Tag 1: {result.jobTags.tag0}</span>
							<span>Job Tag 2: {result.jobTags.tag1}</span>
						</li>
						<li>Job Location: {result.jobLocation}</li>
						<li>Job Description: {result.jobDescription}</li>
					</ul>
				))}
			<button onClick={() => {}}>Load more</button>
		</div>
	);
}
