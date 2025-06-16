import React, { useEffect, useCallback, useState } from 'react';
import { IoTrashOutline } from "react-icons/io5";
import {SERVER_URL} from '../../constants/SERVER_URL';
import { Alert, Button, Label, Spinner, TextInput,Table,Modal } from "flowbite-react";
import Sidebar from '../Sidebar';

export default function ApprovedStations() {
    const [isError,setError]=useState(null);
    const [notApprovedStationsCount,setNotApprovedStationsCount]=useState(0);
    const [notApprovedStations, setNotApprovedStations] = useState([]);
    const [loading,setLoading]=useState(false)
    const [showAll,setShowAll]=useState(false);

    //get all approved stations count
const getNotApprovedStationsCount=useCallback(async()=>{
    setLoading(true)

    try{
    const response=await fetch(`${SERVER_URL}/api/v1/station/not-approved`);
    const data=await response.json();
    if(response.ok){
        setNotApprovedStationsCount(data.totalStations);
        setNotApprovedStations(data.stations)
    }else{
        throw new data.error || "Error fetching parents";
        setLoading(false)
    }
}catch(error){
    setError(error.message)
    console.log(error.message)
}finally{
    setLoading(false)
}
},[])
    // use effect
    useEffect(() => {
        getNotApprovedStationsCount();
    }, [getNotApprovedStationsCount]);

    //toggle height
    const toggleHeight=()=>{
        setShowAll(!showAll)
    }
    return (
        <div>
            <div className='flex justify-between gap-4 w-[95%]  mx-auto'>
                <div className=''>
                    <Sidebar/>
                </div>
                <div className="flex-1 gap-4 mt-4">
                    {/* Teachers div */}
                    <div className={`bg-gray-200 p-1 rounded-md overflow-hidden ${showAll?"h-[500px]":"h-auto"}`}>
                        <div className='flex justify-between bg-gray-200 rounded-md p-2'>
                            <h2 className="flex-1 mx-auto p-2 text-left text-lg text-cyan-700">Stations Awaiting Approval</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Station Name</Table.HeadCell>
                                    <Table.HeadCell>Location</Table.HeadCell>
                                    <Table.HeadCell>Registration Number</Table.HeadCell>
                                    <Table.HeadCell>Business Certificate</Table.HeadCell>
                                    <Table.HeadCell>Station Phone No:</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {notApprovedStations.length >0 && notApprovedStations.map((station) => (
                                        <Table.Row key={station._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {station.username}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {station.town}, {station.county}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {station.RegNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {station.BusinessCert}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {station.phoneNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                            <a href="#" className="font-medium text-cyan-700 hover:text-red-600 hover:underline">View</a>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                        <div className="bg-white p-3">

                            {loading &&
                                <>
                                    <Spinner size="sm" />
                                    <span className='ml-3'>Loading...</span>
                                </>
                            }
                            {
                                isError && <Alert className='mt-4' color="failure">{isError}</Alert>
                            }
                        </div>
                    </div>
                    <div className='z-50 relative p-3 rounded-md border-b-2 border-gray-300'>
                    <Label onClick={toggleHeight} className='text-white bg-cyan-900 p-2 mt-3 rounded-md' gradientDuoTone="pinkToOrange" outline>{showAll?"Show All":"Show Less"}</Label>
                    </div>
                </div>
            </div>
        </div>
    );
}
