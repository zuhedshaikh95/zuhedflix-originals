import { getProducts } from "@stripe/firestore-stripe-payments";
import useAuth from "@/hooks/useAuth";
import useSubscription from "@/hooks/useSubscription";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import payments from "@/lib/stripe";

const Account = () => {
	const { user } = useAuth();
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

			<main className="pt-24">
				<div>
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

				{/* <Membership /> */}

				<div>
					<h4>Plan Details</h4>
					{/* Find the current plan */}
					<div></div>
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
