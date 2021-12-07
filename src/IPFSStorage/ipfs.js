import ipfsAPI from 'ipfs-api';

const client = ipfsAPI('ipfs.infura.io', 5001, { protocols: 'https'} );

export const  IpfsStorage = async(file)=>{

    // const [fileUrl, updateFileUrl] = useState(``)
        // const file = e.target.files[0]
        try {
          const added = await client.files.add(file)
          const url = `https://ipfs.infura.io/ipfs/${added[0].hash}`
        //   updateFileUrl(url)
         return url;
        } catch (error) {
            // return false;
          console.log('Error uploading file: ', error)
        }  
      

}