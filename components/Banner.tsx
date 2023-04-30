import Image from 'next/image'
import { useEffect, useState } from 'react'
import { baseImageURL } from '@/constants/movie'
import { Movie } from '@/typings'
import { FaPlay } from 'react-icons/fa'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { modalState, movieState } from '@/atoms';
import { useRecoilState } from 'recoil';

interface Props {
  trendingNow: Movie[]
}

const Banner = (props: Props) => {
  const { trendingNow } = props
  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState)
  const [showModal, setShowModal] = useRecoilState(modalState);

  useEffect(() => {
    setMovie(
      trendingNow[Math.floor(Math.random() * trendingNow.length)]
    )
  }, [trendingNow]);

  return (
    <div className="flex flex-col space-y-2 h-[85vh] justify-center md:h-[80vh] md:space-y-4 lg:justify-end lg:pb-12">
      <div className="absolute top-0 left-0 -z-10 h-[95vh] w-screen">
        <Image
          src={`${baseImageURL}${movie?.backdrop_path || movie?.poster_path}`}
          fill
          className="object-cover"
          alt=""
        />
      </div>

      <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl">
        {movie?.title || movie?.name}
      </h1>
      <p className="max-w-xs text-shadow-md text-sm md:max-w-lg md:text-lg lg:max-w-2xl">
        {movie?.overview}
      </p>

      <div className="flex space-x-3">
        <button className="bannerButton bg-[#f5f5f1] text-black">
          <FaPlay className="h-4 w-4 text-black" />
          Play
        </button>
        <button className="bannerButton bg-[gray]/70" onClick={() => {
          setCurrentMovie(movie);
          setShowModal(true);
        }}>
          <InformationCircleIcon className="h-5 w-5" />
          More Info
        </button>
      </div>
    </div>
  )
}

export default Banner;
