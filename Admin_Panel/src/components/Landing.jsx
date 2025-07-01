import React from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import landingImg from "../assets/logo.webp";
import dropImg from "../assets/landingImg.webp";

export default function Landing() {
  return (
    <div className="w-full bg-gray-50 ">
      <div className="block md:flex gap-14 w-11/12 md:w-10/12 pt-16 mx-auto">
        <div className="flex flex-1 flex-row border-b-2 border-yellow-400">
          <div>
            <img
              className="w-120 h-auto mx-auto"
              src={dropImg}
              alt="landing image"
            />
          </div>
        </div>
        <div className="flex-1 leading-relaxed pt-10 border-t-2 border-yellow-400">
          <h2 className="font-bold text-3xl md:text-3xl text-cyan-700">
            Your Fuel, Delivered Anywhere, Anytime
          </h2>
          <div className="flex flex-col gap-2">
            <p className="text-normal pt-3 md:pt-4">
              <span className="font-semibold">Stay on the move: </span>Motorists
              can now easily order fuel to their location.
            </p>
            <h2 className="text-normal">
              <span className="font-semibold">Emergency solved!: </span>Enables
              motorists to order fuel in emergency situations.
            </h2>
            <h2 className="text-normal">
              <span className="font-semibold">Manage stations: </span> Only
              authorized and certified stations should be revealed to users
            </h2>
            <h3 className="text-sm md:text-normal italic font-semibold text-cyan-800">
              Solve motorists issues efficiently with{" "}
              <span className="text-yellow-500">fuel</span>mate!
            </h3>
          </div>

          <Link to="/SignIn">
            <Button
              className="w-11/12 md:w-56 mt-14 mx-auto md:mx-0"
              gradientDuoTone="purpleToBlue"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
