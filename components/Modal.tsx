import MuiModal from "@mui/material/Modal";
import ReactPlayer from "react-player/lazy";
import {
	CheckIcon,
	HandThumbUpIcon,
	PlusIcon,
	SpeakerWaveIcon,
	SpeakerXMarkIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "@/atoms";
import { useEffect, useState } from "react";
import { Genre, Movie, Video } from "@/typings";
import { FaPlay } from "react-icons/fa";
import {
	DocumentData,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	setDoc,
} from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { Toaster, toast } from "react-hot-toast";

const Modal = () => {
	const [showModal, setShowModal] = useRecoilState(modalState);
	const [movie, setMovie] = useRecoilState(movieState);
	const [trailer, setTrailer] = useState<Video | null>(null);
	const [genres, setGenres] = useState<Genre[]>([]);
	const [muted, setMuted] = useState<boolean>(false);
	const [fallback, setFallback] = useState<string>("");
	const [addedToList, setAddedToList] = useState<boolean>(false);
	const [userMoviesList, setUserMoviesList] = useState<DocumentData[]>([]);
	const { user } = useAuth();

	const toastStyle = {
		background: '#fff',
		color: '#000',
		fontWeight: 'bold',
		fontSize: '16px',
		padding: '15px',
		borderRadius: '9999px',
		maxWidth: '1000px'
	};

	useEffect(() => {
		if (!movie) return;

		(async () => {
			const data = await fetch(
				`https://api.themoviedb.org/3/${
					movie?.media_type === "tv" ? "tv" : "movie"
				}/${movie?.id}?api_key=${
					process.env.NEXT_PUBLIC_API_KEY
				}&language=en-US&append_to_response=videos`
			)
				.then((res) => res.json())
				.catch((error) => {
					console.log(error.message);
				});

			if (data?.videos) {
				setTrailer(
					data.videos.results.find(
						(video: Video) => video.type === "Trailer"
					)
				);
			}

			if (data?.genres) {
				setGenres(data.genres);
			}

			setFallback("/assets/fallback.mp4");
		})();
	}, [movie]);

	//Find all the movies in the user's collection
	useEffect(() => {
		if (user) {
			return onSnapshot(
				collection(db, "customers", user.uid, "myList"),
				(snapshot) => setUserMoviesList(snapshot.docs)
			);
		}
	}, [db, movie?.id]);

	// Check wether movie exists in user's colelction
	useEffect(
		() =>
			setAddedToList(
				userMoviesList.find(
					(doc: DocumentData) => doc.data().id === movie?.id
				) !== undefined
			),
		[userMoviesList]
	);

	const handleClose = () => {
		setShowModal(false);
	};

	const handleList = async () => {
		if (addedToList) {
			await deleteDoc(
				doc(db, "customers", user!.uid, "myList", movie?.id.toString())
			);

			toast(
				`${
					movie?.title || movie?.original_name
				} has been removed from My List.`,
				{
					duration: 8000,
					style: toastStyle
				}
			);
		} else {
			await setDoc(
				doc(db, "customers", user!.uid, "myList", movie?.id.toString()),
				{ ...movie }
			);

			toast(
				`${
					movie?.title || movie?.original_name
				} has been added to My List.`,
				{
					duration: 8000,
					style: toastStyle
				}
			);
		}
	};

	return (
		<MuiModal
			className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-4xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
			open={showModal}
			onClose={handleClose}
		>
			<>
				<Toaster position="bottom-center" />
				<button
					className="modalButton absolute right-5 top-5 z-40 h-7 w-7 border-none bg-[#181818] hover:bg-[#181818]"
					onClick={handleClose}
				>
					<XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
				</button>

				<div className="relative pt-[56.25%]">
					{/* Fallback Video URL */}
					{/* https://www.youtube.com/watch?v=z7H7NFSUlsY */}
					<ReactPlayer
						url={
							trailer
								? `https://www.youtube.com/watch?v=${trailer?.key}`
								: fallback
						}
						width="100%"
						height="100%"
						loop={trailer === undefined}
						style={{ position: "absolute", top: "0", left: "0" }}
						playing
						muted={muted}
					/>
					<div className="absolute bottom-5 flex w-full items-center justify-between px-5 sm:px-10">
						<div className="flex space-x-2">
							<button className="hidden sm:flex items-center gap-x-2 rounded px-5 py-1 bg-white text-black text-sm font-semibold transition hover:bg-[#e6e6e6] md:text-lg">
								<FaPlay className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
								Play
							</button>

							<button
								className="modalButton"
								onClick={handleList}
							>
								{addedToList ? (
									<CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
								) : (
									<PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
								)}
							</button>

							<button className="modalButton">
								<HandThumbUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
							</button>
						</div>

						<button
							className="modalButton"
							onClick={() => setMuted(!muted)}
						>
							{muted ? (
								<SpeakerXMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
							) : (
								<SpeakerWaveIcon className="h-4 w-4 sm:h-5 sm:w-5" />
							)}
						</button>
					</div>
				</div>

				<div className="flex space-x-16 rounded-b-md bg-[#181818] px-7 py-5 sm:px-10 sm:pt-8 sm:pb-8">
					<div className="space-y-6 text-lg">
						<div className="flex items-end space-x-2 text-sm">
							<p className="font-semibold text-green-400">
								{(movie?.vote_average * 10).toFixed(2)}% Match
							</p>
							<p className="font-light">
								{movie?.release_date || movie?.first_air_date}
							</p>
							<div className="flex items-center justify-center rounded border border-white/40 px-1.5 text-xs">
								HD
							</div>
						</div>

						<h1 className="text-base sm:text-xl font-semibold">
							{movie?.title ||
								movie?.name ||
								movie?.original_name}
						</h1>

						<div className="flex flex-col gap-x-10 gap-y-4 font-light sm:font-normal md:flex-row">
							<p className="sm:w-5/6 text-sm sm:text-lg">
								{movie?.overview}
							</p>
							<div className="flex flex-col space-y-3 text-sm sm:text-base">
								<div>
									<span className="text-[gray]">Genres:</span>{" "}
									{genres
										.map((genre: Genre) => genre.name)
										.join(", ")}
								</div>

								<div>
									<span className="text-[gray]">
										Original language:
									</span>{" "}
									{movie?.original_language}
								</div>

								<div>
									<span className="text-[gray]">
										Total votes:
									</span>{" "}
									{movie?.vote_count}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		</MuiModal>
	);
};

export default Modal;
