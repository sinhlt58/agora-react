
interface Props {
  quality: number;
}
export const NetworkQualityComponent = ({ quality }: Props) => {
  return (
    <>
      {quality === 0 && <span className="text-black">Unknow</span>}
      {quality === 1 && <span className="text-green-500">Excellent</span>}
      {quality === 2 && <span className="text-yellow-500">Good</span>}
      {quality >= 4 && <span className="text-red-500">Poor</span>}
    </>
  )
}
