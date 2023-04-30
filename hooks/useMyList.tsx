import { useState, useEffect } from "react";
import { Movie } from "@/typings";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const useMyList = (uid: string | undefined) => {
	const [list, setList] = useState<Movie[] | DocumentData[]>([]);

	useEffect(() => {
		if (!uid) return;

		return onSnapshot(collection(db, "customers", uid, "myList"),
			(snapshot) => {
				setList(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
			}
		);
	}, [db, uid]);

	return list;
};

export default useMyList;
