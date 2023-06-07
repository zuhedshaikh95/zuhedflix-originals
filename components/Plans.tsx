import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Product } from "@stripe/firestore-stripe-payments";
import { Loader, Table } from "./";
import { loadCheckout } from "@/lib/stripe";
import logo from "../public/assets/zuheflix.png";
import Image from "next/image";

interface Props {
	products: Product[];
}

const Plans = (props: Props) => {
	const { products } = props;
	const { user, logout } = useAuth();
	const [selectedPlan, setSelectedPlan] = useState<Product>(products[3]);
	const [billingLoading, setBillingLoading] = useState<boolean>(false);

	const subscribeToPlan = () => {
		if (!user) return;

		loadCheckout(selectedPlan?.prices[0].id!);
		setBillingLoading(true);
	};

	return (
		<div>
			<Head>
				<title>Zuhedflix</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className="relative border-b border-white/10 bg-[#141414]">
				<Link href="/">
					<Image
						src={logo}
						className="cursor-pointer object-contain w-[100px] sm:w-[120px]"
						alt=""
					/>
				</Link>
				<button
					className="text-md font-medium hover:underline"
					onClick={logout}
				>
					Sign Out
				</button>
			</header>

			<main className="max-w-5xl mx-auto px-5 pt-10 pb-12 transition-all md:px-10">
				<h1 className="mb-3 text-3xl font-medium">
					Choose the plan that's right for you
				</h1>
				<ul>
					<li className="flex items-center gap-x-2 text-base sm:text-lg">
						<CheckIcon className="h-4 w-4 sm:h-7 sm:w-7 text-[#E50914]" />{" "}
						Watch all you want. Ad-free.
					</li>
					<li className="flex items-center gap-x-2 text-base sm:text-lg">
						<CheckIcon className="h-4 w-4 sm:h-7 sm:w-7 text-[#E50914]" />{" "}
						Recommendations just for you.
					</li>
					<li className="flex items-center gap-x-2 text-base sm:text-lg">
						<CheckIcon className="h-4 w-4 sm:h-7 sm:w-7 text-[#E50914]" />{" "}
						Change or cancel your plan anytime.
					</li>
				</ul>

				<div className="mt-4 flex flex-col space-y-4">
					<div className="flex w-full items-center justify-end self-end md:w-4/5">
						{products.map((product: Product) => (
							<div
								className={`planBox ${
									selectedPlan?.id === product.id
										? "opacity-100"
										: "opacity-60"
								}`}
								key={product.id}
								onClick={() => setSelectedPlan(product)}
							>
								{product.name}
							</div>
						))}
					</div>

					<Table products={products} selectedPlan={selectedPlan} />

					<button
						disabled={!selectedPlan || billingLoading}
						className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
							billingLoading && "opacity-60"
						}`}
						onClick={subscribeToPlan}
					>
						{billingLoading ? <Loader size="7" /> : "Subscribe"}
					</button>
				</div>
			</main>
		</div>
	);
};

export default Plans;
