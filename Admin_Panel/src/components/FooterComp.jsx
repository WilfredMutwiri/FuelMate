import React from 'react'
import {BsFacebook,BsInstagram,BsTwitterX,BsWhatsapp} from 'react-icons/bs'
import { Footer, FooterTitle } from "flowbite-react";
import logo from '../assets/logo.webp';

export default function FooterComp() {
    return (
        <div>
            <div className="mt-20"> 
                <Footer container className="border border-t-4 border-teal-500">
                    <div className="w-full">
                    <div className="block md:flex justify-between">
                        <div className=''>
                        <div className="flex w-full justify-between">
                        <img className='w-auto h-20' src={logo} alt='logo'/>
                        <h2 className="font-semibold text-xl my-auto -ml-8">School<span className='text-pink-700'>Sync</span></h2>
                        </div>
                        <h2 className="text-sm italic mb-3 mt-2 md:mt-0 md:mb-0">Your Ultimate School Manager</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                            <Footer.Title title="About"/>
                            <Footer.LinkGroup col>
                                <Footer.Link target="_blank" href="#">
                                Getting Started
                                </Footer.Link>
                            </Footer.LinkGroup>
                            </div>
                            <div>
                            <Footer.Title title="Privacy"/>
                            <Footer.LinkGroup col>
                                <Footer.Link target="_blank" href="#">
                                Terms & Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                            </div>
                            <div>
                            <Footer.Title title="Follow us"/>
                            <Footer.LinkGroup col>
                                <Footer.Link target="_blank" href="#">
                                Facebook
                                </Footer.Link>
                                <Footer.Link target="_blank" href="#">
                                Twitter X
                                </Footer.Link>
                            </Footer.LinkGroup>
                            <div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <Footer.Divider/>
                    <div>
                    <Footer.Copyright by="SchoolSync" className='text-center' year={new Date().getFullYear()} />
                    <div className="flex gap-6 mt-2 w-40 mx-auto">
                        <Footer.Icon href="#" icon={BsFacebook}/>
                        <Footer.Icon href="#" icon={BsInstagram}/>
                        <Footer.Icon href="#" icon={BsTwitterX}/>
                        <Footer.Icon href="#" icon={BsWhatsapp}/>
                    </div>
                    <h2 className='text-center pt-3 text-sm text-blue-900 font-semibold'>Developed by <a className='text-pink-700' href='https://wilfredmutwiri.vercel.app/'>Wilfred Mutwiri</a></h2>
                </div>
                    </div>
                </Footer>
            </div>
        </div>
    );
}
