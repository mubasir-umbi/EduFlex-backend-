import nodemailer from 'nodemailer'


const verifyEmail = async(email, otp)=>{
    try {

       const trasporter =  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: 'mubasirumbi1@gmail.com',
                pass: 'dlpyobkzuxjbkngi'
            }
        })
        
        const mailoptions = {
                from:'mubasirumbi1@gmail.com',
                to: email,
                subject: "For verify mail",
                text: otp
        }

        trasporter.sendMail(mailoptions, (error, info)=>{
          if(error){
            console.log(error);
          }else{
            console.log("Email has been sent");
          }
        })
        
    } catch (error) {
        console.log(error);
    }
}

export default verifyEmail 