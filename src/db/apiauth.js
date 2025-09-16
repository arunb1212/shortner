 import supabase from "./supabase";


 const login= async({email,password})=>{

    const{data,error}=await supabase.auth.signInWithPassword({
        email,password,
    })

    if(error) throw new Error(error.message)

        return data
 }

 export default login