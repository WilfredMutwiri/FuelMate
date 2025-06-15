import React from 'react'
import { Button, Label, TextInput, Textarea } from "flowbite-react";

export default function ParentsSquare() {
    return ( 
        <div>
           <div className="bg-gray-300 rounded-md p-3 w-full mt-4">
                            <h2 className="text-center font-semibold text-orange-500">Parents Square</h2>
                            <div className="block md:flex gap-6">
                                <div className=" pt-3 flex flex-col gap-4 flex-1">
                                <h2>Send Message to:</h2>
                                    <div className="flex gap-3">
                                    <Button className="w-full">All Parents</Button>
                                    </div>
                                    <hr />
                                    <div>
                                    <Label value="All Parents except"/>
                                    <TextInput type="text" className="mt-2 mb-2" placeholder="07 00 000 000"/>
                                    </div>
                                    <hr />
                                    <div>
                                    <Label value="Special Parent"/>
                                    <TextInput type="text" className="mt-2 mb-2" placeholder="07 00 000 000"/>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Textarea className="w-full h-72 mt-4" placeholder="Dear Sir/Madam, you are hearby notified that..."/>
                                    <Button className="w-full mt-3" gradientDuoTone="pinkToOrange" outline>
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </div>
        </div>
     );
}
