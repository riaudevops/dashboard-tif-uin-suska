import PartProgressBar from "./PartProgressBar"

interface props {
    currentStep : number
}

const PartProgressBarData = ["Surat Pengantar", "Surat Jawaban" ,"Input Id Pengantar Dosen Pembimbing", "Dokumen Penunjukkan Dosen Pembimbing", "Selesai"]

export default function ProgressBar({currentStep} : props) {
    return <div className="flex">
        {PartProgressBarData.map((item, i) => {
        let status : boolean | undefined = false

        if (currentStep === i*2+1) {
            status = undefined
        } else if (currentStep > i*2+1) {
            status = true
        }

        return <PartProgressBar key={i} status={status} text={item} isFirst={i === 0} isLast={i === PartProgressBarData.length-1}/>})
        }
    </div>
}