import * as DocumentPicker  from 'expo-document-picker'
import axios from 'axios';
import { SERVER_URI } from '../constants/SERVER_URI';
export const documentPicker =async()=>{
    try{
        const result=await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory:true,
            multiple:false,
            type:'*/*'
        });

        if(result.canceled){
            console.log("User canceled file picker")
            return
        }

        const file=result.assets[0];
        console.log(file);

        const formData=new FormData();
        formData.append('file',{
            uri:file.uri,
            name:file.name,
            type:file.mimeType || 'application/octet-stream'
        });

        const response=await axios.post(`${SERVER_URI}/api/v1/upload/`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
        });
        console.log("upload response",response.data)
        return response.data;
    }
    catch(err){
        console.log('Error Picking Document',err)
    }
}
