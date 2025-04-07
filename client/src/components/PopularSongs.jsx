// import React from "react";
// import love from "../assets/images/love.svg";
// import AddLove from "../assets/images/AddLove.svg";
// import addToList from "../assets/images/addToList.svg";
// import imageSong from "../assets/images/imageSong.png";

// const PopularSongsData = [
//   {
//     id: 1,
//     title: "Smells Like Incense",
//     artist: "Jack Harlow",
//     image: "",
//     date: "Sept 21, 2023",
//     duration: "2:33",
//     isAdded: false,
//     isLoved: false,
//   },
//   {
//     id: 2,
//     title: "Confetti",
//     artist: "Artist Name",
//     image: "",
//     date: "Oct 5, 2023",
//     duration: "3:12",
//     isAdded: true,
//     isLoved: true,
//   },
//   {
//     id: 3,
//     title: "Smells Like Incense",
//     artist: "Jack Harlow",
//     image: "",
//     date: "Sept 21, 2023",
//     duration: "2:33",
//     isAdded: false,
//     isLoved: false,
//   },
//   {
//     id: 4,
//     title: "Smells Like Incense",
//     artist: "Jack Harlow",
//     image: "",
//     date: "Sept 21, 2023",
//     duration: "2:33",
//     isAdded: false,
//     isLoved: false,
//   },
//   // Add more songs here as needed
// ];

// const PopularSongs = () => {
//   return (
//     <div className="w-[1585px] mt-20 h-auto relative bg-[#2a2b2e] rounded-[50px] p-8">
//       <div className="text-white text-[50px] font-bold font-['Roboto Flex'] mb-10">
//         Most Popular Songs
//       </div>
//       {PopularSongsData.map((song, index) => (
//         <div
//           key={song.id}
//           className="flex justify-between items-center mb-6 p-4 rounded-[15px] bg-[#2e3135]"
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-[50px] h-[50px]">
//               <img
//                 src={song.image || imageSong}
//                 alt={song.title}
//                 className="rounded-full w-full h-full object-cover"
//               />
//             </div>
//             <div className="flex flex-col">
//               <div className="text-white text-[16px] font-semibold">
//                 {song.title}
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="h-[20px] px-2 bg-[#dcc6bc] rounded-sm flex justify-center items-center">
//                   <div className="text-black text-xs font-medium">E</div>
//                 </div>
//                 <div className="text-[#bcbcbc] text-sm">{song.artist}</div>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-6 w-[500px]">
//             <img
//               src={song.isLoved ? AddLove : love}
//               alt="Love Icon"
//               className="w-6 h-6 cursor-pointer"
//             />
//             <img
//               src={addToList}
//               alt="Add to List Icon"
//               className="w-6 h-6 cursor-pointer"
//             />
//             <div className="flex gap-2">
//               <button className="bg-[#0b4f6c] text-[#dcc6bc] px-4 py-2 rounded-md text-sm font-bold">
//                 Translated
//               </button>
//               <button className="border-2 border-[#dcc6bc] text-[#dcc6bc] px-4 py-2 rounded-md text-sm font-bold">
//                 Transliterated
//               </button>
//             </div>
//             <div className="text-[#bcbcbc] text-sm">{song.date}</div>
//             <div className="text-[#bcbcbc] text-sm">{song.duration}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PopularSongs;
