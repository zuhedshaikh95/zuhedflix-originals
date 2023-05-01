import { useEffect, useState } from "react";
import Link from "next/link";
import {
	BellIcon,
	MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/solid";
import { BasicMenu } from "./";
import Image from "next/image";
// import logo from '../public/assets/netflix.svg';
import logo from '../public/assets/zuheflix.png';

const Header = () => {
	const [isScrolled, setIsScrolled] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<header className={`${isScrolled && "bg-[#141414]"}`}>
			<div className="flex items-center space-x-2 md:space-x-10">
				<Image
					src={logo}
					width={120}
					height={100}
					alt=""
					className="cursor-pointer object-contain"
				/>

				<BasicMenu />

				<ul className="hidden space-x-4 md:flex">
					<li className="headerLink">Home</li>
					<li className="headerLink">TV Shows</li>
					<li className="headerLink">Movies</li>
					<li className="headerLink">New & Popular</li>
					<li className="headerLink">My List</li>
				</ul>
			</div>

			<div className="flex items-center space-x-4 text-sm font-light">
				<SearchIcon className="hidden sm:inline h-6 w-6" />
				<p className="hidden lg:inline">Kids</p>
				<BellIcon className="h-6 w-6" />
				<Link href="/account">
					<img
						src="https://rb.gy/g1pwyx"
						alt=""
						className="cursor-pointer rounded"
					/>
				</Link>
			</div>
		</header>
	);
};

export default Header;
