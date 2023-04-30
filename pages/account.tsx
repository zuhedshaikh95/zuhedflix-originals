import { getProducts, Product } from "@stripe/firestore-stripe-payments";
import useAuth from "@/hooks/useAuth";
import useSubscription from "@/hooks/useSubscription";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import payments from "@/lib/stripe";
import { Membership } from "@/components";
import { goToBillingPortal } from "@/lib/stripe";

interface Props {
	products: Product[];
}

const Account = (props: Props) => {
	const { products } = props;
	const { user, logout } = useAuth();
	const subscription = useSubscription(user);

	return (
		<div>
			<Head>
				<title>Account Settings - Netflix</title>
				<link rel="icon" href="/favicon.ico"></link>
			</Head>

			<header className="bg-[#141414]">
				<Link href="/">
					<img
						src="https://rb.gy/ulxxee"
						width={120}
						height={120}
						className="cursor-pointer object-contain"
						alt=""
					/>
				</Link>

				<Link href="/account">
					<img
						src="https://rb.gy/g1pwyx"
						className="cursor-pointer rounded"
						alt=""
					/>
				</Link>
			</header>

			<main className="mx-auto max-w-6xl pt-24 px-5 pb-12 transition-all md:px-10">
				<div className="flex flex-col gap-x-4 md:flex-row md:items-end">
					<h1 className="text-3xl md:text-4xl">Account</h1>
					<div className="-ml-0.5 flex items-center gap-x-1.5">
						<img
							src="https://rb.gy/4vfk4r"
							className="h-7 w-7"
							alt=""
						/>
						<p className="text-sm font-semibold text-[#555]">
							Member since {subscription?.created}
						</p>
					</div>
				</div>

				<Membership />

				<div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
					<h4 className="text-lg text-[gray]">Plan Details</h4>
					{/* Find the current plan */}
					<div className="col-span-2 font-medium">
						{
							products.find(
								(product: Product) =>
									product.id === subscription?.product
							)?.name
						}
					</div>
					<p
						className="cursor-pointer text-blue-500 hover:underline md:text-right"
						onClick={goToBillingPortal}
					>
						Change plan
					</p>
				</div>

				<div>
					<div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
						<h4 className="text-lg text-[gray]">Settings</h4>
						<p
							className="col-span-3 cursor-pointer text-blue-500 hover:underline"
							onClick={logout}
						>
							Sign out of all devices
						</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Account;

export const getStaticProps: GetStaticProps = async () => {
	const products = await getProducts(payments, {
		includePrices: true,
		activeOnly: true,
	})
		.then((response) => response)
		.catch((error) => console.log(error.message));

	return {
		props: {
			products,
		},
	};
};
