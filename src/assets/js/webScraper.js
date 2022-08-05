import cheerio from 'cheerio';
import axios from 'axios';

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
	$('#job-list li .job-link').each(function (i, elem) {
		results[i].jobLink = `https://www.flexjobs.com${$(elem).attr('href')}`;
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

	const numberOfResults = parseInt(
		$('.job-category-jobs > div:first-of-type h4')
			?.text()
			.replace(/\s/g, '')
			.split('of')[1]
			.split('for')[0]
	);

	return { results, numberOfResults };
}

export default async function getScrapedJobs(query) {
	if (!query || !query.job) return { results: [], numberOfResults: 0 };
	const job = await query.job?.replace(' ', '+');
	const location = (await query.location?.replace(' ', '+')) || '';
	const pageNumber = (await query.pageNumber) || 1;

	const results = getResults(job, location, pageNumber);

	return results;
}
