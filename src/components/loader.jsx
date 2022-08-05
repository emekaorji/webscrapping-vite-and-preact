import '../assets/css/loader.css';

export default function Loader({ width = '20em', height = '2em' }) {
	return (
		<div style={{ width: width, height: height }} class='loader-container'>
			<div class='loader'></div>
		</div>
	);
}
