import spin from "@/assets/img/spinner.png";

function Spinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
      <img src={spin} alt="Loading spinner" className="animate-spin w-42" />
    </div>
  );
}

export default Spinner;
