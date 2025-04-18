"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button"; 
import Label from "../form/Label"; 

import {  EyeIcon, PencilIcon,TrashBinIcon } from "@/icons";

import { useRouter } from 'next/navigation';
 
export default function LocationList() {
    const router = useRouter();

    type locationsObj = {
        id: string;  // Ensure this matches your actual API response
        name: string;
        address: string;
    };

    const [locationInfo,setLocationInfo] = useState(
        { 
          name: '',
          address: ''
        }
    );
 
    const { isOpen, openModal, closeModal } = useModal(); 

    const [locations, setLocations] = useState([]); 

    const [labelLocationAction, setLabelLocationAction]= useState("");
 
    useEffect(() => {
        fetchLocations( );
    }, []); 

    const fetchLocations = async () => {
        try { 

            const response = await axios.get("/api/location",{}); 
            console.log(response.data);
            setLocations(response.data); 
          } catch (error) {
            console.error("Error fetching products:", error);
          }
    }; 

    const openFormModal = ()=> {
        openModal();
        setLabelLocationAction('Enter New');

        const locatItem = { 
            Id: '',
            name:  '',
            address: '', 
          };
     
        setLocationInfo(locatItem);  

    }

    const handleSave = async (e:  React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
          
            const actionType = labelLocationAction; 

            if( actionType == 'Update' ){
                await axios.put('/api/location', locationInfo);  
            } else {    
                console.log(locationInfo);
                await axios.post('/api/location', locationInfo);  
            } 
 
            fetchLocations();
            closeModal();
        } catch (error) {
            console.error('Error adding product:', error);
           // setError('Failed to add product. Please try again.');
        }
    }

    const getLocation =  (id: string) => {
        try {
            
          if (!filterLocation || filterLocation.length === 0) {
            console.error('Locaiton is empty or undefined');
            return;
          }
    
          openModal();
          setLabelLocationAction('Update');
          const locId = id; 
          const result = filterLocation.filter(resLoc => (resLoc as locationsObj).id === locId);
 

          if (result.length === 0) {
            console.error('No matching Location found');
            return;
          }
      
    
          const locatItem = { 
            Id: locId,
            name: result[0].name ?? '',
            address: result[0].address ?? '', 
          };
           
          setLocationInfo(locatItem);  

        } catch (error) {
            console.error('Error deleting product:', error);
        }

    }

    const viewLocation = (id: string) => {
        try {
             
            router.push('/locations/location-record?id='+id);

        } catch (error) {
            console.error('Error deleting product:', error);
        }

    }


    const filterLocation : locationsObj[] = locations;
 
    return (
        <div className="space-y-6"> 
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md"> 
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={openFormModal}   className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                    Add New Location
                    </button>
                </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              

                {filterLocation.length > 0 ? ( filterLocation.map((location) => (
                    <div key={location.id} className="rounded-2xl border border-gray-200 bg-white  dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {/* <a href={`/locations/${location.id}`}> */}
                        <div className="flex items-end justify-between mt-5">
                            <div>
                                <h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400"> 
                                        {location.name}
                                    </span> 
                                </h3>
                                <p>
                                    <span className="text-sm text-gray-500 dark:text-gray-400"> 
                                        <a href={location.address} target="_blank"> Click to see the Address</a> 
                                    </span> 
                                </p>
                    
                                <div className="flex gap-5">
                                    <button  > 
                                    <EyeIcon   onClick={() => viewLocation(location.id)} /> 
                                    </button>
                                    <button    onClick={() => getLocation(location.id)}  >
                                    <PencilIcon />
                                    </button> 
                                    <button  > 
                                    <TrashBinIcon /> 
                                    </button>
                                </div> 
    
                            </div> 
                        </div> 
                    </div>
                ))
                ) : (
                    <h1>  No Location Found </h1>
                )}
 
            
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {labelLocationAction} Location
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                     Manage your Location details 
                    </p>
                </div>
 
                <form onSubmit={handleSave} className="flex flex-col">
                    <div className="px-2 overflow-y-auto custom-scrollbar"> 
                        <div className="py-2 grid grid-cols-1 gap-x-6 gap-y-5 ">
                            <div>
                                <Label>Location Name</Label>
                                <Input 
                                type="text"   
                                onChange={(e) => setLocationInfo({ ...locationInfo, name: e.target.value })}
                                defaultValue={locationInfo.name} 
                                />
                            </div>
                        </div>
                        <div className="py-2 grid grid-cols-1 gap-x-6 gap-y-5 ">
                            <div>
                                <Label>Location Address</Label>
                                <Input 
                                type="text"
                                onChange={(e) => setLocationInfo({ ...locationInfo, address: e.target.value })}
                                defaultValue={locationInfo.address}
                                />
                            </div> 
                        </div> 
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={closeModal}>
                            Close
                        </Button> 
                        <Button size="sm" type="submit">
                            Save Changes
                        </Button>
                    </div> 
                </form>
                </div>
            </Modal>

        </div>
    );
}