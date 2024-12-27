import { Delete, GppGood } from "@mui/icons-material"

const Notification = () => {
  return (
    <div>
        <div className="wrapper">
        <div className="cards space-y-4 w-[95%] md:w-[90%] mx-auto mt-20">
                <div className="card relative border flex-1 rounded-lg px-2 py-4 shadow-lg duration-300 hover:-translate-y-2 hover:shadow-green-100 flex justify-between items-center">
                    <div className=" flex items-center gap-4 md:gap-16">
                        <div className=" ml-2 md:ml-10">
                            <GppGood sx={{color:"red"}}/>
                        </div>
                        <div>
                            <h2 className=" text-base md:text-lg lg:text-x text-red-600 font-[500]">Alert message</h2>
                            <h4 className="max-[500px]:text-[2.8vw] text-[2.4vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.3vw] font-[400] text-red-600 ">Something went wrong with your account</h4>
                        </div>
                    </div>
                    <div className=" text-end">
                        <Delete/>
                    </div>
                </div>
                <div className="card border flex-1 relative rounded-lg px-2 py-4 shadow-lg duration-300 hover:-translate-y-2 hover:shadow-green-100 flex justify-between items-center">
                    <div className=" flex items-center gap-4 md:gap-16">
                        <div className=" ml-2 md:ml-10">
                            <GppGood sx={{color:"green"}}/>
                        </div>
                        <div>
                            <h2 className=" text-base md:text-lg lg:text-xl text-green-500 font-[500]">Alert message</h2>
                            <h4 className="max-[500px]:text-[2.8vw] text-[2.4vw] sm:text-[2vw] md:text-[1.8vw] lg:text-[1.3vw] font-[400] text-green-500 ">Something went wrong with your account</h4>
                        </div>
                    </div>
                    <div className=" text-end">
                        <Delete/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notification