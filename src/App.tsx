import LandingPage from "@/components/landing/landing-page";
import {ThemeProvider} from "@/components/theme-provider";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="theme">
			<LandingPage />
		</ThemeProvider>
	);
}

export default App;
