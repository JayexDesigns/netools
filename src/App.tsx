import {ThemeProvider} from "./components/theme-provider";

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="theme">
			<main>
				<h1 className="text-red-500">Hello World!</h1>
			</main>
		</ThemeProvider>
	);
}

export default App;
