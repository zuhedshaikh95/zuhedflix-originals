import MuiModal from '@mui/material/Modal'
import ReactPlayer from 'react-player/lazy'
import {
  HandThumbUpIcon,
  PlusIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '@/atoms'
import { useEffect, useState } from 'react'
import { Genre, Video } from '@/typings'
import { FaPlay } from 'react-icons/fa'

const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [muted, setMuted] = useState<boolean>(false);
  const [fallback, setFallback] = useState<string>('');

  useEffect(() => {
    if (!movie) return;

    ;(async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((res) => res.json());

      console.log(data);

      if (data?.videos) {
        setTrailer(
          data.videos.results.find((video: Video) => video.type === 'Trailer')
        );

        if(!trailer) {
          setTimeout(() => {
            setFallback('/assets/fallback.mp4');
          }, 1000);
        }
      }

      if (data?.genres) {
        setGenres(data.genres)
      }
    })()
  }, [movie])

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <MuiModal
      className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-4xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      open={showModal}
      onClose={handleClose}
    >
      <>
        <button
          className="modalButton absolute right-5 top-5 z-40 h-7 w-7 border-none bg-[#181818] hover:bg-[#181818]"
          onClick={handleClose}
        >
          <XMarkIcon className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        <div className="relative pt-[56.25%]">
          {/* Fallback Video URL */}
          {/* https://www.youtube.com/watch?v=z7H7NFSUlsY */}
          <ReactPlayer
            url={trailer ? `https://www.youtube.com/watch?v=${trailer?.key}` : fallback}
            width="100%"
            height="100%"
            loop={trailer === undefined}
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing
            muted={muted}
          />
          <div className="absolute bottom-5 flex w-full items-center justify-between px-5 sm:px-10">
            <div className="flex space-x-2">
              <button className="hidden sm:flex items-center gap-x-2 rounded px-5 py-1 bg-white text-black text-sm font-semibold transition hover:bg-[#e6e6e6] md:text-lg">
                <FaPlay className="h-4 w-4 sm:h-6 sm:w-6 text-black" />
                Play
              </button>

              <button className="modalButton">
                <PlusIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </button>

              <button className="modalButton">
                <HandThumbUpIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </button>
            </div>

            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <SpeakerXMarkIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              ) : (
                <SpeakerWaveIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-7 py-5 sm:px-10 sm:py-8">
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

            <div className="flex flex-col gap-x-10 gap-y-4 font-light sm:font-normal md:flex-row">
              <p className="sm:w-5/6 text-sm sm:text-lg">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm sm:text-base">
                <div>
                  <span className="text-[gray]">Genres:</span>{' '}
                  {genres.map((genre: Genre) => genre.name).join(', ')}
                </div>

                <div>
                  <span className="text-[gray]">Original language:</span>{' '}
                  {movie?.original_language}
                </div>

                <div>
                  <span className="text-[gray]">Total votes:</span>{' '}
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  )
}

export default Modal
