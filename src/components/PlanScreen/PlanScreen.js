import React, { useState, useEffect } from "react";
import "./PlanScreen.css";
import db from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import { changeSubscription } from "../../features/userSlice";
import { useDispatch } from "react-redux";

function PlanScreen() {
    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        db.collection("customers")
            .doc(user.uid)
            .collection("subscriptions")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async (subscription) => {
                    setSubscription({
                        role: subscription.data().role,
                        current_period_end: subscription.data()
                            .current_period_end.seconds,
                        current_period_start: subscription.data()
                            .current_period_start.seconds,
                    });
                });
            });
    }, []);

    useEffect(() => {
        db.collection("products")
            .where("active", "==", true)
            .get()
            .then((querySnapshot) => {
                const products = {};
                querySnapshot.forEach(async (productDoc) => {
                    products[productDoc.id] = productDoc.data();
                    const priceSnap = await productDoc.ref
                        .collection("prices")
                        .get();
                    priceSnap.docs.forEach((price) => {
                        products[productDoc.id].prices = {
                            priceId: price.id,
                            priceData: price.data(),
                        };
                    });
                });
                setProducts(products);
            });
    }, []);

    useEffect(() => {
        if (products && subscription) {
            Object.entries(products).map(([productId, productData]) => {
                const isCurrentPackage = productData.name
                    ?.toLowerCase()
                    .includes(subscription?.role);

                if (isCurrentPackage) {
                    dispatch(changeSubscription(productData.name));
                }
            });
        }
    }, [products, subscription]);

    const loadCheckout = async (priceId) => {
        setIsLoading(true);
        const docRef = await db
            .collection("customers")
            .doc(user.uid)
            .collection("checkout_sessions")
            .add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });

        docRef.onSnapshot(async (snap) => {
            const { error, sessionId } = snap.data();
            if (error) {
                alert("An error occured " + error.message);
            }
            if (sessionId) {
                const stripe = await loadStripe(
                    "pk_test_51HRhSXBtRU7ZYeOS90R5iWmwHHteMTwv0ZHmGHOlyD5KcDuEV09z7AY8SE9BOLGFRdS2XcKJikw6ANdP4gUtnjB000TG1w4Wva"
                );

                stripe.redirectToCheckout({ sessionId });
            }
        });
    };

    return (
        <div className="planScreen">
            {subscription && (
                <p>
                    Renewal date:{" "}
                    {new Date(
                        subscription?.current_period_end * 1000
                    ).toLocaleDateString()}
                </p>
            )}

            {isLoading && <h5>Please wait...</h5>}
            {!isLoading && (
                <>
                    {Object.entries(products).map(
                        ([productId, productData]) => {
                            const isCurrentPackage = productData.name
                                ?.toLowerCase()
                                .includes(subscription?.role);

                            return (
                                <div
                                    key={productId}
                                    className={`${
                                        isCurrentPackage &&
                                        "planScreen__plan--disabled"
                                    } planScreen__plan`}
                                >
                                    <div className="palnScreen__info">
                                        <h5>{productData.name}</h5>
                                        <h6>{productData.description}</h6>
                                    </div>

                                    <button
                                        onClick={() =>
                                            !isCurrentPackage &&
                                            loadCheckout(
                                                productData.prices.priceId
                                            )
                                        }
                                    >
                                        {isCurrentPackage
                                            ? "Current Package"
                                            : "Subscribe"}
                                    </button>
                                </div>
                            );
                        }
                    )}
                </>
            )}
        </div>
    );
}

export default PlanScreen;
