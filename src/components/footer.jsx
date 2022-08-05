import styles from '../assets/css/footer.module.css';

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<p>
				Made with 💖, vscode, chrome and tired eyes by{' '}
				<a href='https://github.com/emekaorji'>Emeka Orji</a>
			</p>
		</footer>
	);
}
