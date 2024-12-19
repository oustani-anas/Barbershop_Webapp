import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';

@Controller('/booking')
export class BookingController {

    
    @Get('/test')
    test(){
        console.log("teeeest");
        return("tesst")
    }
    
    // @Post('/appointments')
    // async appoint(
    //     @Query('date') date: string, 
    //     @Query('Barberid') barberid: string, 
    //     // @Query('customer') customer: string
    // )
    //     {
    //         console.log(`the date is ${date} and the id of barber ${barberid}`);
    //         // console.log(customer);
    // }
    
    @Post('/appointments')
    async appoint(@Body() appointmentDetails: any) {
        console.log("test the req")       
        console.log("the infos appointment : " , appointmentDetails);
    }
}
