export interface ItemsTest_changedcom {
    type?: string;
    devicename?: string;
    datachanged?: string;
    approvedate?: string;
}

export interface ItemTest_empty {
    type?: string;
    devicename?: string;
    datachanged?: string;
    approvedate?: string;    
}

export interface ItemTest_expiring {
    software?: string;
    version?: string;
    licence?: string;
    buydate?: string;
    expiration?:string;
}
