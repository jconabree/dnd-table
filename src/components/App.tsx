import { HelmetProvider } from "react-helmet-async";
// import { DragDropContext } from 'react-beautiful-dnd';
import ConfiguratorProvider from "~/context/ConfiguratorProvider";
import { Router } from "~/components/Router";

export const App = () => {
	return (
		<HelmetProvider>
			<main>
				<ConfiguratorProvider>
					{/* <DragDropContext> */}
						<Router />
					{/* </DragDropContext> */}
				</ConfiguratorProvider>
			</main>
		</HelmetProvider>
	)
};
