import styles from '../assets/css/searchForm.module.css';

import { useState } from 'preact/hooks';
import Loader from './loader';

export default function SearchForm({
	setSearchQuery,
	isSubmitting,
	setIsSubmitting,
}) {
	const [jobValue, setJobValue] = useState('Frontend Engineer');
	const [locationValue, setLocationValue] = useState('');

	const handleSubmit = () => {
		setIsSubmitting(true);
		setSearchQuery((searchQuery) => ({
			...searchQuery,
			job: jobValue,
			location: locationValue,
		}));
	};

	return (
		<form
			className={styles.form}
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}>
			<input
				className={styles.input}
				type='text'
				value={jobValue}
				onInput={(e) => setJobValue(e.target.value)}
				placeholder='Search for jobs'
				disabled={isSubmitting}
				onKeyDown={(e) => e.which === 13 && handleSubmit()}
			/>
			<input
				className={styles.input}
				type='text'
				value={locationValue}
				onInput={(e) => setLocationValue(e.target.value)}
				placeholder='Search location'
				disabled={isSubmitting}
				onKeyDown={(e) => e.which === 13 && handleSubmit()}
			/>
			{isSubmitting && (
				<div className={styles.formDisabledCover}>
					<Loader width='10em' height='.5em' />
				</div>
			)}
		</form>
	);
}
