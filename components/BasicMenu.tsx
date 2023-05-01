import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { useState } from "react";
import { VscTriangleDown } from "react-icons/vsc";

export default function BasicMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className="md:hidden">
			<Button
				id="basic-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				className="!capitalize !text-white"
			>
				Browse
				<VscTriangleDown className="h-5 w-5 ml-1" />
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				className="mobileMenu"
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem onClick={handleClose}>Home</MenuItem>
				<MenuItem onClick={handleClose}>TV Shows</MenuItem>
				<MenuItem onClick={handleClose}>Movies</MenuItem>
				<MenuItem onClick={handleClose}>New & Popular</MenuItem>
				<MenuItem onClick={handleClose}>
					<Link href="/my-list">My List</Link>
				</MenuItem>
			</Menu>
		</div>
	);
}
