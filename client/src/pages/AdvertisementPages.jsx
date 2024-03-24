import React from "react";
import VerticalCard from "../components/VerticalCard";
import Navbar from "../components/Navbar"
import AdvertisementCard from "../components/AdvertisementCard";
import StarRating from "../components/StarRating";

export default function () {
    return (
        <>
            <Navbar />
            <main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 h-[100vh] overflow-show">
                    <AdvertisementCard
                        image={["https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492", "https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492", "https://cdn.motor1.com/images/mgl/6ZzGrX/s3/modified-mazda-rx-7-driving-at-the-nurburgring-source-micha-charoudin-youtube.jpg"]}
                        title={"Mazda RX-7"}
                        price={"30,000"}
                        dateposted={"December 31 2023"}
                        location={"Toronto, ON"}
                        description={
                            "The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
                        }
                        userimg={"https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492"}
                        sellername={"Shams Kadriusu"}
                        rating={<StarRating rating={2}/>}
                        ad1={"https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492"}
                        ad2={"https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492"}
                        ad3={"https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492"}
                        postID={1}
                    />

            </main>
        </>
    );
}
