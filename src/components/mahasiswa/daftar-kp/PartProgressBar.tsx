interface props{
    isFirst : boolean,
    isLast : boolean,
    text : string,
    status? : boolean
}

// status :
// true = sudah selesai
// false = belum selesai
// undefined = posisi saat ini

export default function PartProgressBar({text, status, isFirst, isLast} : props) {
    let circle = <div className={`rounded-full size-[35px] bg-green-200 flex items-center justify-center`}>
    <div className={`size-[25px] rounded-full border-[2px] border-white text-white font-bold text-center`}>ℹ</div>
    </div>

    if (status) {
        circle = <div className={`rounded-full size-[35px] bg-green-600 flex items-center justify-center`}>
        <div className={`size-[25px] rounded-full border-[2px] border-white text-white font-bold text-center`}>ℹ</div>
        </div>
    }

    if (status === undefined) {
        circle = <div className="rounded-full size-[45px] border-[2px] border-green-600 bg-white flex items-center justify-center">
        <div className={`rounded-full size-[35px] bg-green-600 flex items-center justify-center`}>
    <div className={`size-[25px] rounded-full border-[2px] border-white text-white font-bold text-center`}>ℹ</div>
    </div>
    </div>
    status = true;
    }

    return <div>
    <div className="flex items-center justify-center">
        <div className="h-[65px] bg-black"></div>
        <div className={`h-[5px] ${!isFirst ? (!status ? "bg-green-200 w-[100px]" : "bg-green-600 w-[100px]") : "w-[20px]"}`}></div>
        {circle}
        <div className={`h-[5px] ${!isLast ? (!status ? "bg-green-200" : "bg-green-600") : ""} w-[20px]`}></div>
    </div>
    <div className="flex justify-end">
        <div className={`${status === undefined ? "size-[85px]" : "size-[75px]"} text-xs text-center`}>
        {text}
        </div>
    </div>
    </div>
}