import {
	DevicePhoneMobileIcon,
	DeviceTabletIcon,
	ComputerDesktopIcon,
	TvIcon,
} from "@heroicons/react/24/outline";
import { Product } from "@stripe/firestore-stripe-payments";

interface Props {
	products: Product[];
	selectedPlan: Product;
}

const deviceIcons: JSX.Element[] = [
	<DevicePhoneMobileIcon className="h-7 w-full" />,
	<DeviceTabletIcon className="h-7 w-full -rotate-90" />,
	<ComputerDesktopIcon className="h-7 w-full" />,
	<TvIcon className="h-7 w-full" />,
];
const device: string[] = ["Phone", "Tablet", "Computer", "TV"];

const Table = (props: Props) => {
	const { products, selectedPlan } = props;

	return (
		<table>
			<tbody className="divide-y divide-[gray]">
				<tr className="tableRow">
					<td className="tableDataTitle">Monthly price</td>
					{products.map((product: Product) => (
						<td
							className={`tableDataFeature ${
								selectedPlan?.id === product?.id
									? "text-[#e50914]"
									: "text-[#737373]"
							}`}
							key={product.id}
						>
							{(product.prices[0].unit_amount! /
								100)!.toLocaleString("en-IN", {
								style: "currency",
								currency: "INR",
								maximumFractionDigits: 0,
							})}
						</td>
					))}
				</tr>

				<tr className="tableRow">
					<td className="tableDataTitle">Video quality</td>
					{products.map((product: Product) => (
						<td
							className={`tableDataFeature ${
								selectedPlan?.id === product?.id
									? "text-[#e50914]"
									: "text-[#737373]"
							}`}
							key={product.id}
						>
							{product.metadata.video_quality}
						</td>
					))}
				</tr>

				<tr className="tableRow">
					<td className="tableDataTitle">Resolution</td>
					{products.map((product: Product) => (
						<td
							className={`tableDataFeature ${
								selectedPlan?.id === product?.id
									? "text-[#e50914]"
									: "text-[#737373]"
							}`}
							key={product?.id}
						>
							{product.metadata.resolution}
						</td>
					))}
				</tr>

				<tr className="tableRow">
					<td className="tableDataTitle">
						Devices you can use to watch
					</td>
					{products.map((product: Product) => (
						<td
							className={`tableDataFeature flex flex-col justify-start h-[250px] ${
								selectedPlan?.id === product?.id
									? "text-[#e50914]"
									: "text-[#737373]"
							}`}
							key={product.id}
						>
							{product.stripe_metadata_devices
								.split(" ")
								.map(Number)
								.map((index: number) => (
									<div
										key={index}
										className="font-[500] text-sm pb-2"
									>
										{deviceIcons[index]}
										{device[index]}
									</div>
								))}
						</td>
					))}
				</tr>
			</tbody>
		</table>
	);
};

export default Table;
