import Head from "next/head";
import payments from "../lib/stripe";
import { Movie } from "@/typings";
import { requests } from "@/utils";
import { Header, Banner, Row, Modal, Plans } from "@/components";
import { modalState } from "@/atoms";
import { useAuth, useSubscription } from '@/hooks'
import { useRecoilValue } from "recoil";
import { getProducts, Product } from "@stripe/firestore-stripe-payments";

interface Props {
	netflixOriginals: Movie[];
	trendingNow: Movie[];
	topRated: Movie[];
	actionMovies: Movie[];
	comedyMovies: Movie[];
	horrorMovies: Movie[];
	romanceMovies: Movie[];
	documentaries: Movie[];
	scienceFiction: Movie[];
	animatedMovies: Movie[];
	fantasyMovies: Movie[];
	warMovies: Movie[];
	products: Product[];
}

const Home = (props: Props) => {
	const {
		netflixOriginals,
		actionMovies,
		comedyMovies,
		documentaries,
		horrorMovies,
		romanceMovies,
		topRated,
		trendingNow,
		scienceFiction,
		animatedMovies,
		warMovies,
		products,
	} = props;

	const { loading, user } = useAuth();
	const showModal = useRecoilValue(modalState);
	const subscription = useSubscription(user);

	// Blocking the UI
	if (loading || subscription === null) return null;

	if (!subscription) return <Plans products={products} />;

	return (
		<div className="relative h-screen bg-mobile lg:bg-gradient-to-b lg:h-[140vh]">
			<Head>
				<title>Home - Zuhedflix</title>
				<link rel="icon" href="/favicon.ico"></link>
			</Head>

			<Header />

			<main className="relative pl-5 lg:pl-16">
				<Banner trendingNow={trendingNow} />
				<section className="md:space-y-24">
					<Row title="Zuhedflix Originals" movies={netflixOriginals} />
					<Row title="Top Rated" movies={topRated} />
					<Row title="Action Thrillers" movies={actionMovies} />
					<Row title="Animated Movies" movies={animatedMovies} />
					<Row title="Horror Movies" movies={horrorMovies} />
					<Row title="Science Fiction" movies={scienceFiction} />
					<Row title="Romantic Movies" movies={romanceMovies} />
					<Row title="War Movies" movies={warMovies} />
					<Row title="Comedy Movies" movies={comedyMovies} />
					<Row title="Documentaries" movies={documentaries} />
				</section>
				{showModal && <Modal />}
			</main>
		</div>
	);
};

export default Home;

export const getServerSideProps = async () => {
	const products = await getProducts(payments, {
		includePrices: true,
		activeOnly: true,
	})
		.then((response) => response)
		.catch((error) => console.log(error.message));

	const [
		netflixOriginals,
		trendingNow,
		topRated,
		actionMovies,
		comedyMovies,
		horrorMovies,
		romanceMovies,
		documentaries,
		scienceFiction,
		animatedMovies,
		warMovies
	] = await Promise.all([
		fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
		fetch(requests.fetchTrending).then((res) => res.json()),
		fetch(requests.fetchTopRated).then((res) => res.json()),
		fetch(requests.fetchActionMovies).then((res) => res.json()),
		fetch(requests.fetchComedyMovies).then((res) => res.json()),
		fetch(requests.fetchHorrorMovies).then((res) => res.json()),
		fetch(requests.fetchRomanceMovies).then((res) => res.json()),
		fetch(requests.fetchDocumentaries).then((res) => res.json()),
		fetch(requests.fetchScienceFictionMovies).then((res) => res.json()),
		fetch(requests.fetchAnimationMovies).then((res) => res.json()),
		fetch(requests.fetchWarMovies).then((res) => res.json()),
	]);

	return {
		props: {
			netflixOriginals: netflixOriginals.results,
			trendingNow: trendingNow.results,
			topRated: topRated.results,
			actionMovies: actionMovies.results,
			comedyMovies: comedyMovies.results,
			horrorMovies: horrorMovies.results,
			romanceMovies: romanceMovies.results,
			documentaries: documentaries.results,
			scienceFiction: scienceFiction.results,
			animatedMovies: animatedMovies.results,
			warMovies: warMovies.results,
			products,
		},
	};
};
