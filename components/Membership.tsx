import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSubscription from "@/hooks/useSubscription";
import Loader from "./Loader";
import { goToBillingPortal } from "@/lib/stripe";

const Membership = () => {
	const { user } = useAuth();
	const subscription = useSubscription(user);
	const [billingLoading, setBillingLoading] = useState<boolean>(false);

	const manageSubscription = () => {
		if(subscription) {
			setBillingLoading(true);
			goToBillingPortal();
		}
	};

	return (
		<div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
			<div className="space-y-2 py-4">
				<h4 className="text-lg text-[gray]">Membership & Billing</h4>
				<button
					className="h-10 w-3/5 whitespace-nowrap bg-gray-400 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5"
					onClick={manageSubscription}
				>
					{billingLoading ? <Loader /> : "Cancel Membership"}
				</button>
			</div>
		</div>
	);
};

export default Membership;
