import React from 'react'
import logo from '../assets/logo.webp'
const About = () => {
    return (
        <div className='w-11/12 mx-auto flex flex-col gap-3'>
            <div className='flex pt-3'>
                <div className=''>
                <img src={logo} className=''/>
                </div>
                <div className=''>
                <h1 className='font-semibold text-xl border-l-4 border-pink-700 pl-1'>About School<span className='text-pink-600'>Sync</span></h1>
                <p className='leading-relaxed pt-2'>At <span className='font-semibold'>School<span className='text-pink-600'>Sync</span></span>, we believe in transforming how schools communicate and operate. Our innovative platform is designed to simplify school management by providing tools to streamline communication, track student progress, and foster better collaboration between teachers, staff, parents, and administrators.</p>
                </div>
            </div>
            <div>
                <h1 className='font-semibold text-xl border-l-4 border-pink-700 pl-1'>Our Mission</h1>
                <p>
                To empower schools with technology that enhances efficiency, improves communication, and strengthens the connection between schools and their communities.
                </p>
            </div>
            <div>
                <h1 className='font-semibold text-xl border-l-4 border-pink-700 pl-1'>What We Offer</h1>
                <p>
                    <ol className='flex flex-col gap-2 pl-4'>
                        <li>Effortless Communication: Seamlessly send messages to teachers, staff, and parents.
                        </li>
                        <li>
                        Performance Tracking: Monitor and analyze student data to improve learning outcomes.
                        </li>
                        <li>
                        Event Management: Keep everyone informed about important school events and announcements.
                        </li>
                        <li>
                        All-in-One Solution: Manage your school operations from a single, user-friendly platform.
                        </li>
                    </ol>
                </p>
            </div>
            <div >
                <h1 className='font-semibold text-xl border-l-4 border-pink-700 pl-1'>Why Choose SchoolSync?</h1>
                <p>
                We understand the challenges schools face in managing their day-to-day operations. SchoolSync was built with educators and administrators in mind, offering:
                </p>
                <ol>
                    <li>An intuitive interface that’s easy to use.</li>
                    <li>Reliable and secure communication tools.</li>
                    <li>Scalable solutions for schools of all sizes.</li>
                </ol>
                <p className='font-semibold text-sm text-pink-800 italic pt-4'>
                Join the growing community of schools that are transforming their management processes with SchoolSync!
                </p>
            </div>
        </div>
    )
}

export default About;