import {get} from "lodash-es"
export function getTemplate(data:any){
    const info = get(data,"included").find((option:any)=>option.type=="templates")
    return info.attributes.module
}