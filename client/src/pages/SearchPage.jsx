import React from "react";
import VerticalCard from "../components/VerticalCard";
import Navbar from "../components/Navbar"
import SearchSideBar from "../components/SearchSideBar"
export default function SearchPage() {
  return (
    <>
      <Navbar/>
      <main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 h-[100vh] overflow-show">
        <SearchSideBar/>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <VerticalCard
            image={["https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492", "https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492", "https://cdn.motor1.com/images/mgl/6ZzGrX/s3/modified-mazda-rx-7-driving-at-the-nurburgring-source-micha-charoudin-youtube.jpg"]}
            title={"Mazda RX-7"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={
              "The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
            }
            postID={1}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://assets.newatlas.com/dims4/default/76592f1/2147483647/strip/true/crop/1619x1079+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fyamaha-2017-yzf-r6-supersport-23.jpg", "https://nationalmotormuseum.org.uk/wp-content/uploads/2017/11/Yamaha-YZF-R6R-2007-800x531.jpg"]}
            title={"2016 Yamaha YZF-600 R6"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={"This is a bike"}
            postID={2}
          />
          <VerticalCard
            image={["https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492", "https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492", "https://cdn.motor1.com/images/mgl/6ZzGrX/s3/modified-mazda-rx-7-driving-at-the-nurburgring-source-micha-charoudin-youtube.jpg"]}
            title={"Mazda RX-7"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={
              "The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
            }
            postID={1}
          />
          <VerticalCard
            image={["https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492", "https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492", "https://cdn.motor1.com/images/mgl/6ZzGrX/s3/modified-mazda-rx-7-driving-at-the-nurburgring-source-micha-charoudin-youtube.jpg"]}
            title={"Mazda RX-7"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={
              "The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
            }
            postID={1}
          />
          <VerticalCard
            image={["https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492", "https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492", "https://cdn.motor1.com/images/mgl/6ZzGrX/s3/modified-mazda-rx-7-driving-at-the-nurburgring-source-micha-charoudin-youtube.jpg"]}
            title={"Mazda RX-7"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={
              "The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
            }
            postID={1}
          />
          <VerticalCard
            image={["https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492", "https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492", "https://cdn.motor1.com/images/mgl/6ZzGrX/s3/modified-mazda-rx-7-driving-at-the-nurburgring-source-micha-charoudin-youtube.jpg"]}
            title={"Mazda RX-7"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={
              "The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
            }
            postID={1}
          />
          <VerticalCard
            image={["https://www.motortrend.com/uploads/2023/11/sema-rx7-rear-quarter.jpg?fit=around%7C875:492", "https://www.motortrend.com/uploads/2023/08/rx7-fd-front-end.jpg?fit=around%7C875:492", "https://cdn.motor1.com/images/mgl/6ZzGrX/s3/modified-mazda-rx-7-driving-at-the-nurburgring-source-micha-charoudin-youtube.jpg"]}
            title={"Mazda RX-7"}
            price={"30,000"}
            location={"Toronto, ON"}
            description={
              "The Mazda RX-7 is an iconic sports car renowned for its unique rotary engine, lightweight chassis, and sleek design. Introduced in 1978, it gained fame for its performance, handling, and affordability in the sports car market. The RX-7, particularly its FD generation, remains a beloved classic among enthusiasts."
            }
            postID={1}
          />
        </div>
      </main>
    </>
  );
}
