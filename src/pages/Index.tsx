import { Dialog } from '@headlessui/react';
import { useRef, useState } from 'react';
import { Head } from '~/components/Head';
import { Table } from '~/components/Table';

function Index() {
	const [isOpen, setIsOpen] = useState(true);
	const completeButtonRef = useRef(null);

	return (
		<>
			<Head title="TOP PAGE" />
			<div className="h-screen">
				<Table />
			</div>
		</>
	);
}

export default Index;
