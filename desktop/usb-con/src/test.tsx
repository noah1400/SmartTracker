import { getDevices } from './IPCMessages';


function Test(){
    return(
        <div>
            <button onClick={() => {getDevices(); }}> TEST </button>
        </div>
    ); 
}

export default Test