import { HelmetProvider } from "react-helmet-async";
import ConfiguratorProvider from "~/context/ConfiguratorProvider";
import { Router } from "~/components/Router";

export const App = () => {
	return (
		<HelmetProvider>
			<main>
				<ConfiguratorProvider>
					<Router />
				</ConfiguratorProvider>
			</main>
		</HelmetProvider>
	)
};
