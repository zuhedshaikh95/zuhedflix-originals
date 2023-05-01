import { modalState, movieState } from "@/atoms";
import { Header, Modal } from "@/components";
import { useAuth, useMyList } from "@/hooks";
import { Movie } from "@/typings";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import { useRecoilState } from "recoil";

const MyList = () => {
	const { user } = useAuth();
	const userMoviesList = useMyList(user?.uid);
	const [showModal, setShowModal] = useRecoilState(modalState);
    const [movie, setMovie] = useRecoilState(movieState);

	return (
		<div>
			<Header />

			<main className="pt-24 px-5 md:px-10">
				<h1 className="text-xl py-4 sm:text-3xl">My List</h1>
				<div className="grid grid-cols-2 items-center space-x-1.5 space-y-3 md:space-x-2.5 md:grid-cols-3 lg:grid-cols-5">
					{userMoviesList.map((movie: Movie | DocumentData) => (
						<div
							key={movie.id}
							className="relative h-28 cursor-pointer transition duration-200 ease-out md:h-36 md:hover:scale-105 mt-3"
                            onClick={() => {
                                setShowModal(true);
                                setMovie(movie);
                            }}
						>
							<Image
								src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
								className="rounded-sm object-cover md:rounded"
								fill
								alt=""
							/>
						</div>
					))}
				</div>
			</main>

			{showModal && <Modal />}
		</div>
	);
};

export default MyList;
